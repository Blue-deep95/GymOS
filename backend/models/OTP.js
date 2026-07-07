const mongoose = require('mongoose');

const otpSchema = new mongoose.Schema({
    email: {
        type: String,
        required: true,
        lowercase: true,
        trim: true
    },
    otp: {
        type: String,
        required: true
    },
    otpType: {
        type: String,
        enum: ['newUser', 'resetPassword'],
        required: true
    },
    verified: {
        type: Boolean,
        default: false
    },
    otpExpiresAt: {
        type: Date,
        required: true,
        default: () => new Date(Date.now() + 5 * 60 * 1000) // Code valid for 5 minutes
    },
    expiresAt: {
        type: Date,
        required: true,
        default: () => new Date(Date.now() + 24 * 60 * 60 * 1000) // Document deleted after 24 hours
    }
});

// MongoDB TTL index to auto-delete documents when expiresAt (1 day) is reached
otpSchema.index({ expiresAt: 1 }, { expireAfterSeconds: 0 });

module.exports = mongoose.model('OTP', otpSchema);
