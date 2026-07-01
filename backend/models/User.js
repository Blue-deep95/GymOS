const mongoose = require('mongoose');
const bcrypt = require('bcrypt');

const userSchema = new mongoose.Schema({
    fullName: {
        type: String,
        required: true,
        trim: true
    },
    email: {
        type: String,
        required: true,
        unique: true,
        lowercase: true,
        trim: true
    },
    password: {
        type: String,
        required: true
    },
    role: {
        type: String,
        enum: ['owner', 'receptionist', 'trainer', 'member', 'user'],
        default: 'member'
    },
    phone: {
        type: String,
        trim: true
    },
    emergencyContact: {
        type: String,
        trim: true
    },
    fitnessGoals: {
        type: String,
        trim: true
    },
    medicalNotes: {
        type: String,
        trim: true
    },
    assignedTrainer: {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'User'
    },
    currentMembership: {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'Membership'
    }
}, {
    timestamps: true
});

// Pre-save hook to hash password before saving to database
userSchema.pre('save', async function () {
    if (!this.isModified('password')) return;
    const salt = await bcrypt.genSalt(10);
    this.password = await bcrypt.hash(this.password, salt);
});

// Method to compare password for login validation
userSchema.methods.comparePassword = async function (candidatePassword) {
    return bcrypt.compare(candidatePassword, this.password);
};

module.exports = mongoose.model('User', userSchema);
