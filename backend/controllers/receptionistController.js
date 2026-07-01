const User = require('../models/User');
const Membership = require('../models/Membership');
const Attendance = require('../models/Attendance');

/**
 * Fetch list of all members, populated with membership details and coach details.
 */
const getMembersList = async (req, res) => {
    try {
        const members = await User.find({ role: { $in: ['member', 'user'] } })
            .select('-password')
            .populate('assignedTrainer', 'fullName email phone specialization')
            .populate('currentMembership');

        res.status(200).json({ members });
    } catch (err) {
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

        // Calculate a dummy price
        let price = 50; // 1 Month
        if (planType === '3 Months') price = 135; // discount
        if (planType === '6 Months') price = 240; // discount

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
        res.status(500).json({ message: 'Error assigning trainer', error: err.message });
    }
};

/**
 * Check-in a member for attendance.
 * Prevents double check-ins on the same day via schema unique index.
 */
const checkInMember = async (req, res) => {
    try {
        const { memberId } = req.body;

        if (!memberId) {
            return res.status(400).json({ message: 'Member ID is required' });
        }

        // Verify member exists
        const member = await User.findById(memberId);
        if (!member) {
            return res.status(404).json({ message: 'Member not found' });
        }

        // Compute current YYYY-MM-DD string based on local server date
        const todayStr = new Date().toISOString().split('T')[0];

        try {
            const newAttendance = new Attendance({
                memberId,
                date: todayStr,
                checkInTime: new Date()
            });

            await newAttendance.save();

            res.status(201).json({
                message: 'Member checked in successfully',
                attendance: newAttendance
            });
        } catch (dbErr) {
            // Duplicate key error (code 11000) means already checked in today
            if (dbErr.code === 11000) {
                return res.status(400).json({ message: 'Member has already checked in today.' });
            }
            throw dbErr; // escalate to outer catch
        }
    } catch (err) {
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
        res.status(500).json({ message: 'Error retrieving trainers list', error: err.message });
    }
};

module.exports = {
    getMembersList,
    assignMembership,
    assignTrainer,
    checkInMember,
    getTrainersList
};
