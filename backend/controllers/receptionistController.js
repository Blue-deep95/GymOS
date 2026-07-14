const User = require('../models/User');
const Membership = require('../models/Membership');
const Attendance = require('../models/Attendance');
const jwt = require('jsonwebtoken');

/**
 * Fetch list of all members, populated with membership details and coach details.
 */
const getMembersList = async (req, res) => {
    try {
        const members = await User.find({ role: { $in: ['member', 'user'] } })
            .select('-password')
            .populate('assignedTrainer', 'fullName email phone specialization')
            .populate('currentMembership');

        const todayStr = new Date().toISOString().split('T')[0];
        const todayAttendanceCount = await Attendance.countDocuments({ date: todayStr });
        const todayAttendances = await Attendance.find({ date: todayStr })
            .populate('memberId', 'fullName email phone')
            .sort({ checkInTime: -1 });

        res.status(200).json({ members, todayAttendanceCount, todayAttendances });
    } catch (err) {
        console.error('Error in getMembersList:', err);
        res.status(500).json({ message: 'Error retrieving member directory', error: err.message });
    }
};

/**
 * Assign a new membership contract to a member.
 */
const assignMembership = async (req, res) => {
    try {
        const memberId = req.params.id;
        const { planType, startDate } = req.body;

        if (!planType || !['1 Month', '3 Months', '6 Months'].includes(planType)) {
            return res.status(400).json({ message: 'Invalid membership plan type. Must be "1 Month", "3 Months", or "6 Months".' });
        }

        // Verify member exists
        const member = await User.findById(memberId);
        if (!member) {
            return res.status(404).json({ message: 'Member not found' });
        }

        // Compute start and end dates
        const start = startDate ? new Date(startDate) : new Date();
        const end = new Date(start);

        if (planType === '1 Month') {
            end.setMonth(end.getMonth() + 1);
        } else if (planType === '3 Months') {
            end.setMonth(end.getMonth() + 3);
        } else if (planType === '6 Months') {
            end.setMonth(end.getMonth() + 6);
        }

        // Calculate a dummy price (INR)
        let price = 1500; // 1 Month
        if (planType === '3 Months') price = 3500; // discount
        if (planType === '6 Months') price = 6500; // discount

        // Create new membership record
        const newMembership = new Membership({
            memberId,
            planType,
            startDate: start,
            endDate: end,
            status: 'Active',
            price
        });

        await newMembership.save();

        // Set as current active membership on the user document
        member.currentMembership = newMembership._id;
        // Make sure user role is promoted to 'member' if it was 'user'
        if (member.role === 'user') {
            member.role = 'member';
        }
        await member.save();

        res.status(201).json({
            message: 'Membership assigned successfully',
            membership: newMembership
        });
    } catch (err) {
        console.error('Error in assignMembership:', err);
        res.status(500).json({ message: 'Error assigning membership package', error: err.message });
    }
};

/**
 * Assign a trainer to a member (cannot edit or delete trainers, only link them).
 */
const assignTrainer = async (req, res) => {
    try {
        const memberId = req.params.id;
        const { trainerId } = req.body;

        // Verify member exists
        const member = await User.findById(memberId);
        if (!member) {
            return res.status(404).json({ message: 'Member not found' });
        }

        if (trainerId) {
            // Verify trainer exists and has the trainer role
            const trainer = await User.findById(trainerId);
            if (!trainer) {
                return res.status(404).json({ message: 'Trainer not found' });
            }
            if (trainer.role !== 'trainer') {
                return res.status(400).json({ message: 'User is not registered as a trainer' });
            }
        }

        // Link trainer (or clear it if trainerId is empty/null)
        member.assignedTrainer = trainerId || undefined;
        await member.save();

        res.status(200).json({
            message: 'Trainer assigned successfully',
            assignedTrainerId: member.assignedTrainer
        });
    } catch (err) {
        console.error('Error in assignTrainer:', err);
        res.status(500).json({ message: 'Error assigning trainer', error: err.message });
    }
};

/**
 * Check-in a member for attendance.
 * Prevents double check-ins on the same day via schema unique index.
 */
const checkInMember = async (req, res) => {
    try {
        const { memberId, token } = req.body;
        let targetMemberId = memberId;

        if (token) {
            // Validate and decode dynamic check-in token
            try {
                const decoded = jwt.verify(token, process.env.ACCESS_TOKEN_SECRET || 'default_access_secret_key_12345');
                if (decoded.purpose !== 'qr-check-in') {
                    return res.status(400).json({ message: 'Invalid check-in token purpose' });
                }
                targetMemberId = decoded.id;
            } catch (jwtErr) {
                console.error('JWT Error in checkInMember:', jwtErr);
                return res.status(400).json({ message: 'Check-in token expired or invalid. Please scan again.' });
            }
        }

        if (!targetMemberId) {
            return res.status(400).json({ message: 'Member ID or Check-in Token is required' });
        }

        // Verify member exists
        const member = await User.findById(targetMemberId).populate('currentMembership').populate('assignedTrainer');
        if (!member) {
            return res.status(404).json({ message: 'Member not found' });
        }

        // Audit membership status
        if (!member.currentMembership) {
            return res.status(400).json({ message: 'Member has no active membership plan assigned. Please purchase a plan first.' });
        }

        if (member.currentMembership.status === 'Expired') {
            return res.status(400).json({ message: 'Membership has expired. Access denied.' });
        }

        if (member.currentMembership.status === 'Frozen') {
            return res.status(400).json({ message: 'Membership is currently frozen. Unfreeze to check in.' });
        }

        // Compute current YYYY-MM-DD string based on local server date
        const todayStr = new Date().toISOString().split('T')[0];

        try {
            const existingAttendance = await Attendance.findOne({ memberId: targetMemberId, date: todayStr });

            if (existingAttendance) {
                if (existingAttendance.secondCheckInTime) {
                    return res.status(400).json({
                        message: 'Member has already checked in twice today.',
                        member: {
                            id: member._id,
                            fullName: member.fullName,
                            email: member.email,
                            assignedTrainerName: member.assignedTrainer?.fullName || 'Unassigned',
                            planType: member.currentMembership.planType,
                            status: member.currentMembership.status
                        }
                    });
                }

                const firstCheckIn = new Date(existingAttendance.checkInTime);
                const now = new Date();
                const gapMs = now - firstCheckIn;
                const gapHours = gapMs / (1000 * 60 * 60);

                if (gapHours < 10) {
                    const remainingHours = (10 - gapHours).toFixed(1);
                    return res.status(400).json({
                        message: `Check-in denied. A minimum gap of 10 hours is required. Please retry in ${remainingHours} hours.`,
                        member: {
                            id: member._id,
                            fullName: member.fullName,
                            email: member.email,
                            assignedTrainerName: member.assignedTrainer?.fullName || 'Unassigned',
                            planType: member.currentMembership.planType,
                            status: member.currentMembership.status
                        }
                    });
                }

                existingAttendance.secondCheckInTime = now;
                await existingAttendance.save();

                return res.status(200).json({
                    message: `Second check-in successful for ${member.fullName}. Welcome back!`,
                    attendance: existingAttendance,
                    member: {
                        id: member._id,
                        fullName: member.fullName,
                        email: member.email,
                        assignedTrainerName: member.assignedTrainer?.fullName || 'Unassigned',
                        planType: member.currentMembership.planType,
                        status: member.currentMembership.status
                    }
                });
            }

            const newAttendance = new Attendance({
                memberId: targetMemberId,
                date: todayStr,
                checkInTime: new Date()
            });

            await newAttendance.save();

            res.status(201).json({
                message: `Check-in successful for ${member.fullName}`,
                attendance: newAttendance,
                member: {
                    id: member._id,
                    fullName: member.fullName,
                    email: member.email,
                    assignedTrainerName: member.assignedTrainer?.fullName || 'Unassigned',
                    planType: member.currentMembership.planType,
                    status: member.currentMembership.status
                }
            });
        } catch (dbErr) {
            console.error('Database Error in checkInMember save:', dbErr);
            if (dbErr.code === 11000) {
                return res.status(400).json({
                    message: 'Member has already checked in today.',
                    member: {
                        id: member._id,
                        fullName: member.fullName,
                        email: member.email,
                        assignedTrainerName: member.assignedTrainer?.fullName || 'Unassigned',
                        planType: member.currentMembership.planType,
                        status: member.currentMembership.status
                    }
                });
            }
            throw dbErr;
        }
    } catch (err) {
        console.error('Error in checkInMember:', err);
        res.status(500).json({ message: 'Error processing member attendance check-in', error: err.message });
    }
};

/**
 * Fetch list of all trainers.
 */
const getTrainersList = async (req, res) => {
    try {
        const trainers = await User.find({ role: 'trainer' }).select('fullName email specialization');
        res.status(200).json({ trainers });
    } catch (err) {
        console.error('Error in getTrainersList:', err);
        res.status(500).json({ message: 'Error retrieving trainers list', error: err.message });
    }
};

/**
 * Freeze or unfreeze a member's current membership status.
 */
const freezeMembership = async (req, res) => {
    try {
        const memberId = req.params.id;

        // Verify member exists
        const member = await User.findById(memberId);
        if (!member) {
            return res.status(404).json({ message: 'Member not found' });
        }

        if (!member.currentMembership) {
            return res.status(400).json({ message: 'Member has no active membership plan to freeze' });
        }

        const membership = await Membership.findById(member.currentMembership);
        if (!membership) {
            return res.status(404).json({ message: 'Membership record not found' });
        }

        // Toggle state and log history
        const originalStatus = membership.status;
        const newStatus = originalStatus === 'Frozen' ? 'Active' : 'Frozen';
        membership.status = newStatus;

        if (newStatus === 'Frozen') {
            // Log freeze start
            membership.freezeHistory.push({
                frozenAt: new Date()
            });
        } else {
            // Find active freeze log to unfreeze and compute extension duration
            const activeFreeze = membership.freezeHistory.find(f => !f.unfrozenAt);
            if (activeFreeze) {
                activeFreeze.unfrozenAt = new Date();
                
                // Calculate difference in days
                const diffMs = activeFreeze.unfrozenAt.getTime() - activeFreeze.frozenAt.getTime();
                const diffDays = Math.max(1, Math.ceil(diffMs / (1000 * 60 * 60 * 24)));
                
                // Extend validity
                membership.endDate = new Date(membership.endDate.getTime() + diffDays * 24 * 60 * 60 * 1000);
                membership.totalFrozenDays = (membership.totalFrozenDays || 0) + diffDays;
            }
        }

        await membership.save();

        res.status(200).json({
            message: `Membership status updated from ${originalStatus} to ${newStatus}`,
            membership
        });
    } catch (err) {
        console.error('Error in freezeMembership:', err);
        res.status(500).json({ message: 'Error updating membership status', error: err.message });
    }
};

/**
 * Retrieve complete membership registration and renewal history for a member.
 */
const getMemberMembershipHistory = async (req, res) => {
    try {
        const memberId = req.params.id;

        // Verify member exists
        const member = await User.findById(memberId);
        if (!member) {
            return res.status(404).json({ message: 'Member not found' });
        }

        const history = await Membership.find({ memberId }).sort({ createdAt: -1 });

        res.status(200).json({ history });
    } catch (err) {
        console.error('Error in getMemberMembershipHistory:', err);
        res.status(500).json({ message: 'Error retrieving membership history', error: err.message });
    }
};

module.exports = {
    getMembersList,
    assignMembership,
    assignTrainer,
    checkInMember,
    getTrainersList,
    freezeMembership,
    getMemberMembershipHistory
};
