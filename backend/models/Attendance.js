const mongoose = require('mongoose');

const attendanceSchema = new mongoose.Schema({
    memberId: {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'User',
        required: true
    },
    date: {
        type: String, // Store as "YYYY-MM-DD" to easily enforce one check-in per day
        required: true
    },
    checkInTime: {
        type: Date,
        default: Date.now
    }
}, {
    timestamps: true
});

// Enforce unique compound index so a member can only check in once per calendar date
attendanceSchema.index({ memberId: 1, date: 1 }, { unique: true });

module.exports = mongoose.model('Attendance', attendanceSchema);
