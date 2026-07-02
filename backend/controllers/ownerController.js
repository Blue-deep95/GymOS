const User = require('../models/User');
const Membership = require('../models/Membership');
const Attendance = require('../models/Attendance');

/**
 * Fetch operational dashboard metrics for the Owner view.
 */
const getDashboardStats = async (req, res) => {
    try {
        // 1. Active & Expired Membership Counts
        const activeMembersCount = await Membership.countDocuments({ status: 'Active' });
        const expiredMembersCount = await Membership.countDocuments({ status: 'Expired' });

        // 2. Today's Attendance Check-ins
        const todayStr = new Date().toISOString().split('T')[0];
        const todayCheckinsCount = await Attendance.countDocuments({ date: todayStr });

        // 3. New Members Registered This Month
        const startOfMonth = new Date();
        startOfMonth.setDate(1);
        startOfMonth.setHours(0, 0, 0, 0);
        const newMembersThisMonthCount = await User.countDocuments({
            role: { $in: ['member', 'user'] },
            createdAt: { $gte: startOfMonth }
        });

        // 4. Trainer Workload Metrics
        const trainers = await User.find({ role: 'trainer' }).select('fullName specialization');
        const trainerWorkload = await Promise.all(trainers.map(async (trainer) => {
            const clientCount = await User.countDocuments({ assignedTrainer: trainer._id });
            let load = 'Optimal';
            if (clientCount > 25) load = 'High';
            else if (clientCount < 10) load = 'Low';
            return {
                name: trainer.fullName,
                specialization: trainer.specialization || 'Strength & Conditioning',
                clientCount,
                load
            };
        }));

        // 5. 30 Days Attendance Trend
        const startOfRange = new Date();
        startOfRange.setDate(startOfRange.getDate() - 30);
        const rangeDateStr = startOfRange.toISOString().split('T')[0];

        const attendanceLogs = await Attendance.aggregate([
            {
                $match: {
                    date: { $gte: rangeDateStr }
                }
            },
            {
                $group: {
                    _id: '$date',
                    count: { $sum: 1 }
                }
            },
            {
                $sort: { _id: 1 }
            }
        ]);

        // Map logs to a simple number list for trend chart/visual bars (fill default zero for missing dates)
        const trendMap = {};
        attendanceLogs.forEach(log => {
            trendMap[log._id] = log.count;
        });

        const attendanceTrend = [];
        for (let i = 29; i >= 0; i--) {
            const d = new Date();
            d.setDate(d.getDate() - i);
            const dateStr = d.toISOString().split('T')[0];
            attendanceTrend.push(trendMap[dateStr] || 0);
        }

        res.status(200).json({
            activeMembersCount,
            expiredMembersCount,
            todayCheckinsCount,
            newMembersThisMonthCount,
            trainerWorkload,
            attendanceTrend
        });
    } catch (err) {
        res.status(500).json({ message: 'Error compiling owner dashboard stats', error: err.message });
    }
};

/**
 * Compile analytics reports on attendance, memberships, and trainers capacity.
 */
const getReportsData = async (req, res) => {
    try {
        const { reportType, timeRange } = req.query;

        // Compute date filter boundary
        const limitDate = new Date();
        const days = timeRange === '7d' ? 7 : timeRange === '90d' ? 90 : 30;
        limitDate.setDate(limitDate.getDate() - days);
        const limitDateStr = limitDate.toISOString().split('T')[0];

        if (reportType === 'attendance') {
            // Aggregate check-ins
            const totalCheckins = await Attendance.countDocuments({ date: { $gte: limitDateStr } });

            // Mock peak hours & active days for display (replaces static values with semi-dynamic based on check-ins)
            const peakHour = totalCheckins > 0 ? '06:00 PM - 08:00 PM' : 'N/A';
            const activeDay = totalCheckins > 0 ? 'Monday (Avg Check-ins)' : 'N/A';

            // Find absentees: members with no check-in logs in past 30 days
            const thirtyDaysAgo = new Date();
            thirtyDaysAgo.setDate(thirtyDaysAgo.getDate() - 30);
            const activeMemberIds = await Attendance.distinct('memberId', { date: { $gte: thirtyDaysAgo.toISOString().split('T')[0] } });
            
            const absentCount = await User.countDocuments({
                role: { $in: ['member', 'user'] },
                _id: { $nin: activeMemberIds }
            });

            res.status(200).json({
                reportData: [
                    { metric: 'Total Check-ins', value: `${totalCheckins} visits` },
                    { metric: 'Peak Attendance Hour', value: peakHour },
                    { metric: 'Most Active Day', value: activeDay },
                    { metric: 'Absentee Alert (>30 Days)', value: `${absentCount} members flagged` }
                ]
            });

        } else if (reportType === 'memberships') {
            const activeCount = await Membership.countDocuments({ status: 'Active' });

            // Expiring in next 7 days
            const oneWeekLater = new Date();
            oneWeekLater.setDate(oneWeekLater.getDate() + 7);
            const expiringCount = await Membership.countDocuments({
                status: 'Active',
                endDate: { $lte: oneWeekLater }
            });

            // New registrations in range
            const newRegistrations = await Membership.countDocuments({
                startDate: { $gte: limitDate }
            });

            // Estimated revenue
            const revenueSum = await Membership.aggregate([
                { $match: { status: 'Active' } },
                { $group: { _id: null, total: { $sum: '$price' } } }
            ]);
            const revenue = revenueSum[0]?.total || 0;

            res.status(200).json({
                reportData: [
                    { metric: 'Total Active Packages', value: `${activeCount} contracts` },
                    { metric: 'Expiring This Week', value: `${expiringCount} members warning` },
                    { metric: 'New Registrations (Period)', value: `+${newRegistrations} signups` },
                    { metric: 'Active Monthly Run Rate', value: `$${revenue}` }
                ]
            });

        } else if (reportType === 'trainers') {
            const trainers = await User.find({ role: 'trainer' }).select('fullName');
            const reportData = await Promise.all(trainers.map(async (t) => {
                const count = await User.countDocuments({ assignedTrainer: t._id });
                let status = 'optimal';
                if (count > 25) status = 'high';
                else if (count < 10) status = 'low';
                return {
                    metric: `${t.fullName} workload`,
                    value: `${count} active (${status})`
                };
            }));

            res.status(200).json({ reportData });
        } else {
            res.status(400).json({ message: 'Invalid report type specified' });
        }
    } catch (err) {
        res.status(500).json({ message: 'Error compiling operations records', error: err.message });
    }
};

/**
 * Retrieve all registered gym members (full directory).
 */
const getMembersList = async (req, res) => {
    try {
        const members = await User.find({ role: { $in: ['member', 'user'] } })
            .select('-password')
            .populate('currentMembership')
            .populate('assignedTrainer', 'fullName');

        res.status(200).json({ members });
    } catch (err) {
        res.status(500).json({ message: 'Error retrieving member directory', error: err.message });
    }
};

/**
 * Retrieve all registered trainers (trainer registry) with active client counts.
 */
const getTrainersList = async (req, res) => {
    try {
        const trainers = await User.find({ role: 'trainer' }).select('-password');
        const list = await Promise.all(trainers.map(async (t) => {
            const clientCount = await User.countDocuments({ assignedTrainer: t._id });
            let load = 'Optimal';
            if (clientCount > 25) load = 'High';
            else if (clientCount < 10) load = 'Low';

            return {
                _id: t._id,
                fullName: t.fullName,
                email: t.email,
                phone: t.phone || 'N/A',
                specialization: t.specialization || 'Strength & Conditioning',
                availability: t.availability || 'Mon - Fri (AM/PM)',
                clientCount,
                load
            };
        }));

        res.status(200).json({ trainers: list });
    } catch (err) {
        res.status(500).json({ message: 'Error compiling trainer registry', error: err.message });
    }
};

/**
 * Add/Register a new trainer profile.
 */
const createTrainer = async (req, res) => {
    try {
        const { fullName, email, password, phone, specialization, availability } = req.body;

        if (!fullName || !email || !password) {
            return res.status(400).json({ message: 'Missing required credentials (name, email, or password)' });
        }

        const existingUser = await User.findOne({ email });
        if (existingUser) {
            return res.status(400).json({ message: 'A user with this email address already exists' });
        }

        const newTrainer = new User({
            fullName,
            email,
            password,
            phone,
            specialization,
            availability,
            role: 'trainer'
        });

        await newTrainer.save();

        res.status(201).json({
            message: 'Trainer registered successfully',
            trainer: {
                _id: newTrainer._id,
                fullName: newTrainer.fullName,
                email: newTrainer.email,
                role: newTrainer.role
            }
        });
    } catch (err) {
        res.status(500).json({ message: 'Error adding new trainer profile', error: err.message });
    }
};

module.exports = {
    getDashboardStats,
    getReportsData,
    getMembersList,
    getTrainersList,
    createTrainer
};
