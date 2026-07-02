const mongoose = require('mongoose');

const measurementSchema = new mongoose.Schema({
    memberId: {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'User',
        required: true
    },
    recordedBy: {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'User',
        required: true
    },
    recordedAt: {
        type: Date,
        default: Date.now
    },
    weight: {
        type: Number,
        required: true
    },
    bodyFat: {
        type: Number,
        required: true
    },
    chest: {
        type: Number,
        required: true
    },
    waist: {
        type: Number,
        required: true
    },
    arms: {
        type: Number,
        required: true
    },
    thighs: {
        type: Number,
        required: true
    },
    notes: {
        type: String,
        trim: true
    }
}, {
    timestamps: true
});

module.exports = mongoose.model('Measurement', measurementSchema);
