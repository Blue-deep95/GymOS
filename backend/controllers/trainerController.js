const User = require('../models/User');
const Attendance = require('../models/Attendance');
const WorkoutTemplate = require('../models/WorkoutTemplate');
const AssignedProgram = require('../models/AssignedProgram');

/**
 * Fetch overview stats for the trainer dashboard.
 */
const getDashboardStats = async (req, res) => {
    try {
        const trainerId = req.user.id;

        // Count assigned members
        const assignedMembersCount = await User.countDocuments({ assignedTrainer: trainerId });

        // Get list of assigned member IDs
        const members = await User.find({ assignedTrainer: trainerId }).select('_id');
        const memberIds = members.map(m => m._id);

        // Fetch recent attendance for these members
        const recentAttendance = await Attendance.find({ memberId: { $in: memberIds } })
            .sort({ checkInTime: -1 })
            .limit(10)
            .populate('memberId', 'fullName email');

        // 30 Days Attendance Trend
        const startOfRange = new Date();
        startOfRange.setDate(startOfRange.getDate() - 30);
        const rangeDateStr = startOfRange.toISOString().split('T')[0];

        const attendance30Days = await Attendance.aggregate([
            {
                $match: {
                    memberId: { $in: memberIds },
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

        // Top Attending Members (leaderboard)
        const topMembers = await Attendance.aggregate([
            {
                $match: {
                    memberId: { $in: memberIds }
                }
            },
            {
                $group: {
                    _id: '$memberId',
                    checkInCount: { $sum: 1 }
                }
            },
            {
                $sort: { checkInCount: -1 }
            },
            {
                $limit: 5
            }
        ]);

        const topMembersPopulated = await User.populate(topMembers, {
            path: '_id',
            select: 'fullName email'
        });

        const topAttending = topMembersPopulated.map(item => ({
            member: item._id,
            checkInCount: item.checkInCount
        }));

        res.status(200).json({
            assignedMembersCount,
            recentAttendance,
            attendance30Days,
            topAttending
        });
    } catch (err) {
        res.status(500).json({ message: 'Error retrieving trainer stats', error: err.message });
    }
};

/**
 * Fetch members assigned to this trainer, along with their active programs.
 */
const getAssignedMembers = async (req, res) => {
    try {
        const trainerId = req.user.id;

        const members = await User.find({ assignedTrainer: trainerId })
            .select('-password')
            .populate('currentMembership');

        const membersWithPrograms = await Promise.all(members.map(async (member) => {
            const activeProgram = await AssignedProgram.findOne({ memberId: member._id }).sort({ assignedAt: -1 });
            return {
                ...member.toObject(),
                activeProgram
            };
        }));

        res.status(200).json({ members: membersWithPrograms });
    } catch (err) {
        res.status(500).json({ message: 'Error retrieving assigned members', error: err.message });
    }
};

/**
 * Assign a workout template as a copied program to a member.
 */
const assignProgram = async (req, res) => {
    try {
        const trainerId = req.user.id;
        const memberId = req.params.id;
        const { templateId } = req.body;

        if (!templateId) {
            return res.status(400).json({ message: 'Template ID is required' });
        }

        // Verify member exists and is assigned to this trainer
        const member = await User.findById(memberId);
        if (!member) {
            return res.status(404).json({ message: 'Member not found' });
        }
        if (member.assignedTrainer && member.assignedTrainer.toString() !== trainerId) {
            return res.status(403).json({ message: 'This member is not assigned to you' });
        }

        // Fetch template details
        const template = await WorkoutTemplate.findById(templateId);
        if (!template) {
            return res.status(404).json({ message: 'Workout template not found' });
        }

        // Create deep copy of days/exercises to insulate from future template changes
        const programDays = template.days.map(day => ({
            dayName: day.dayName,
            exercises: day.exercises.map(ex => ({
                exerciseName: ex.exerciseName,
                sets: ex.sets,
                reps: ex.reps,
                notes: ex.notes
            }))
        }));

        const newProgram = new AssignedProgram({
            memberId,
            trainerId,
            programName: template.name,
            days: programDays
        });

        await newProgram.save();

        res.status(201).json({
            message: 'Program assigned successfully',
            assignedProgram: newProgram
        });
    } catch (err) {
        res.status(500).json({ message: 'Error assigning workout program', error: err.message });
    }
};

/**
 * Get templates created by this trainer.
 */
const getWorkoutTemplates = async (req, res) => {
    try {
        const trainerId = req.user.id;
        const templates = await WorkoutTemplate.find({ trainerId }).sort({ createdAt: -1 });
        res.status(200).json({ templates });
    } catch (err) {
        res.status(500).json({ message: 'Error fetching workout templates', error: err.message });
    }
};

/**
 * Create a new reusable workout template.
 */
const createWorkoutTemplate = async (req, res) => {
    try {
        const trainerId = req.user.id;
        const { name, description, days } = req.body;

        if (!name) {
            return res.status(400).json({ message: 'Template name is required' });
        }

        const newTemplate = new WorkoutTemplate({
            name,
            trainerId,
            description,
            days: days || []
        });

        await newTemplate.save();

        res.status(201).json({
            message: 'Workout template created successfully',
            template: newTemplate
        });
    } catch (err) {
        res.status(500).json({ message: 'Error creating workout template', error: err.message });
    }
};

/**
 * Delete a workout template owned by this trainer.
 */
const deleteWorkoutTemplate = async (req, res) => {
    try {
        const trainerId = req.user.id;
        const templateId = req.params.id;

        const template = await WorkoutTemplate.findOneAndDelete({ _id: templateId, trainerId });

        if (!template) {
            return res.status(404).json({ message: 'Template not found or unauthorized' });
        }

        res.status(200).json({ message: 'Template deleted successfully' });
    } catch (err) {
        res.status(500).json({ message: 'Error deleting workout template', error: err.message });
    }
};

/**
 * Remove/unassign the workout program from a member.
 */
const removeProgram = async (req, res) => {
    try {
        const trainerId = req.user.id;
        const memberId = req.params.id;

        // Verify member exists and is assigned to this trainer
        const member = await User.findById(memberId);
        if (!member) {
            return res.status(404).json({ message: 'Member not found' });
        }
        if (member.assignedTrainer && member.assignedTrainer.toString() !== trainerId) {
            return res.status(403).json({ message: 'This member is not assigned to you' });
        }

        // Delete all assigned programs for this member
        await AssignedProgram.deleteMany({ memberId });

        res.status(200).json({ message: 'Program removed successfully' });
    } catch (err) {
        res.status(500).json({ message: 'Error removing workout program', error: err.message });
    }
};

module.exports = {
    getDashboardStats,
    getAssignedMembers,
    assignProgram,
    getWorkoutTemplates,
    createWorkoutTemplate,
    deleteWorkoutTemplate,
    removeProgram
};
