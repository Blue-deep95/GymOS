const mongoose = require('mongoose');

const assignedExerciseSchema = new mongoose.Schema({
    exerciseName: {
        type: String,
        required: true
    },
    sets: {
        type: Number,
        default: 3
    },
    reps: {
        type: String,
        default: '10'
    },
    notes: {
        type: String,
        trim: true
    }
});

const assignedDaySchema = new mongoose.Schema({
    dayName: {
        type: String,
        required: true,
        default: 'Workout Day'
    },
    exercises: [assignedExerciseSchema]
});

const assignedProgramSchema = new mongoose.Schema({
    memberId: {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'User',
        required: true
    },
    trainerId: {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'User',
        required: true
    },
    programName: {
        type: String,
        required: true,
        trim: true
    },
    days: [assignedDaySchema],
    assignedAt: {
        type: Date,
        default: Date.now
    }
}, {
    timestamps: true
});

module.exports = mongoose.model('AssignedProgram', assignedProgramSchema);
