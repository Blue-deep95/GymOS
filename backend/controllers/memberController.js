const User = require('../models/User');
const Attendance = require('../models/Attendance');
const AssignedProgram = require('../models/AssignedProgram');
const Measurement = require('../models/Measurement');
const Membership = require('../models/Membership');

/**
 * Fetch all operational and workout metrics for a member's dashboard profile.
 */
const getDashboardData = async (req, res) => {
    try {
        const memberId = req.user.id;

        // Fetch member profile details
        const member = await User.findById(memberId)
            .populate('assignedTrainer', 'fullName email specialization experience availability')
            .populate('currentMembership');

        if (!member) {
            return res.status(404).json({ message: 'Member profile not found' });
        }

        // Calculate membership days remaining
        let daysRemaining = 0;
        if (member.currentMembership && member.currentMembership.endDate) {
            const end = new Date(member.currentMembership.endDate);
            const now = new Date();
            daysRemaining = Math.max(0, Math.ceil((end - now) / (1000 * 60 * 60 * 24)));
        }

        // Recommendation: If no trainer is assigned, fetch list of available trainers
        let recommendedTrainers = [];
        if (!member.assignedTrainer) {
            recommendedTrainers = await User.find({ role: 'trainer' })
                .select('fullName email specialization experience availability')
                .limit(5);
        }

        // Fetch current active workout program prescribed to this member
        const activeProgram = await AssignedProgram.findOne({ memberId })
            .sort({ assignedAt: -1 });

        // Fetch recent attendance logs
        const attendance = await Attendance.find({ memberId })
            .sort({ checkInTime: -1 })
            .limit(15);

        res.status(200).json({
            member: {
                id: member._id,
                fullName: member.fullName,
                email: member.email,
                phone: member.phone,
                emergencyContact: member.emergencyContact,
                medicalNotes: member.medicalNotes,
                fitnessGoals: member.fitnessGoals,
                role: member.role,
                status: member.status,
                currentMembership: member.currentMembership,
                assignedTrainer: member.assignedTrainer
            },
            daysRemaining,
            recommendedTrainers,
            activeProgram,
            attendance
        });
    } catch (err) {
        res.status(500).json({ message: 'Error retrieving member dashboard metrics', error: err.message });
    }
};

/**
 * Retrieve progress measurement logs history for the logged-in member.
 */
const getProgressHistory = async (req, res) => {
    try {
        const memberId = req.user.id;
        const progressHistory = await Measurement.find({ memberId })
            .sort({ recordedAt: -1 });

        res.status(200).json({ progressHistory });
    } catch (err) {
        res.status(500).json({ message: 'Error fetching progress logs', error: err.message });
    }
};

/**
 * Handle member self-service membership package purchase.
 */
const purchaseMembership = async (req, res) => {
    try {
        const memberId = req.user.id;
        const { planType } = req.body;

        if (!planType || !['1 Month', '3 Months', '6 Months'].includes(planType)) {
            return res.status(400).json({ message: 'Invalid membership plan type. Must be "1 Month", "3 Months", or "6 Months".' });
        }

        const member = await User.findById(memberId).populate('currentMembership');
        if (!member) {
            return res.status(404).json({ message: 'Member profile not found' });
        }

        // Prevent purchasing if already subscribed with an Active/Frozen plan
        if (member.currentMembership && ['Active', 'Frozen'].includes(member.currentMembership.status)) {
            return res.status(400).json({
                message: 'You already have an active or frozen membership subscription. Contact reception to upgrade or modify your package.'
            });
        }

        // Calculate end date
        const start = new Date();
        const end = new Date(start);

        if (planType === '1 Month') {
            end.setMonth(end.getMonth() + 1);
        } else if (planType === '3 Months') {
            end.setMonth(end.getMonth() + 3);
        } else if (planType === '6 Months') {
            end.setMonth(end.getMonth() + 6);
        }

        // Price mapping
        let price = 50;
        if (planType === '3 Months') price = 135;
        if (planType === '6 Months') price = 240;

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

        // Update user
        member.currentMembership = newMembership._id;
        if (member.role === 'user') {
            member.role = 'member';
        }
        await member.save();

        res.status(201).json({
            message: 'Membership acquired successfully',
            membership: newMembership
        });
    } catch (err) {
        res.status(500).json({ message: 'Error processing membership purchase', error: err.message });
    }
};

module.exports = {
    getDashboardData,
    getProgressHistory,
    purchaseMembership
};
