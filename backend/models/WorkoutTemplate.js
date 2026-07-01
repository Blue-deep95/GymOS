const mongoose = require('mongoose');

const exerciseSchema = new mongoose.Schema({
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

const daySchema = new mongoose.Schema({
    dayName: {
        type: String,
        required: true,
        default: 'Workout Day'
    },
    exercises: [exerciseSchema]
});

const workoutTemplateSchema = new mongoose.Schema({
    name: {
        type: String,
        required: true,
        trim: true
    },
    trainerId: {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'User',
        required: true
    },
    description: {
        type: String,
        trim: true
    },
    days: [daySchema]
}, {
    timestamps: true
});

module.exports = mongoose.model('WorkoutTemplate', workoutTemplateSchema);
