const User = require('../models/User');
const Attendance = require('../models/Attendance');
const AssignedProgram = require('../models/AssignedProgram');

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

module.exports = {
    getDashboardData
};
