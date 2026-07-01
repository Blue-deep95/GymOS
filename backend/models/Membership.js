const mongoose = require('mongoose');

const membershipSchema = new mongoose.Schema({
    memberId: {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'User',
        required: true
    },
    planType: {
        type: String,
        enum: ['1 Month', '3 Months', '6 Months'],
        required: true
    },
    startDate: {
        type: Date,
        required: true
    },
    endDate: {
        type: Date,
        required: true
    },
    status: {
        type: String,
        enum: ['Active', 'Expired', 'Frozen', 'Inactive'],
        default: 'Active'
    },
    price: {
        type: Number
    }
}, {
    timestamps: true
});

module.exports = mongoose.model('Membership', membershipSchema);
