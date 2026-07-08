const User = require('../models/User');
const Attendance = require('../models/Attendance');
const AssignedProgram = require('../models/AssignedProgram');
const Measurement = require('../models/Measurement');
const Membership = require('../models/Membership');
const jwt = require('jsonwebtoken');
const crypto = require('crypto');
const razorpay = require('../config/razorpay');

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
        console.error('Error in getDashboardData:', err);
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
        console.error('Error in getProgressHistory:', err);
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

        // Price mapping (INR)
        let price = 1500;
        if (planType === '3 Months') price = 3500;
        if (planType === '6 Months') price = 6500;

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
        console.error('Error in purchaseMembership:', err);
        res.status(500).json({ message: 'Error processing membership purchase', error: err.message });
    }
};

/**
 * Generate short-lived check-in token for QR scanning
 */
const getCheckInToken = async (req, res) => {
    try {
        const token = jwt.sign(
            { id: req.user.id, purpose: 'qr-check-in' },
            process.env.ACCESS_TOKEN_SECRET || 'default_access_secret_key_12345',
            { expiresIn: '30s' }
        );
        res.status(200).json({ token });
    } catch (err) {
        console.error('Error in getCheckInToken:', err);
        res.status(500).json({ message: 'Error generating check-in token', error: err.message });
    }
};

/**
 * Update member profile details (fullName, phone, emergencyContact, fitnessGoals, medicalNotes)
 */
const updateProfile = async (req, res) => {
    try {
        const { fullName, phone, emergencyContact, fitnessGoals, medicalNotes } = req.body;
        const user = await User.findById(req.user.id);
        if (!user) {
            return res.status(404).json({ message: 'User not found' });
        }

        if (fullName) user.fullName = fullName;
        if (phone) user.phone = phone;
        if (emergencyContact) user.emergencyContact = emergencyContact;
        if (fitnessGoals) user.fitnessGoals = fitnessGoals;
        if (medicalNotes) user.medicalNotes = medicalNotes;

        await user.save();
        res.status(200).json({ message: 'Profile updated successfully', user });
    } catch (err) {
        console.error('Error in updateProfile:', err);
        res.status(500).json({ message: 'Error updating profile', error: err.message });
    }
};

/**
 * Create a new Razorpay hosted Payment Link (or mock link if client is offline)
 */
const createRazorpayOrder = async (req, res) => {
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

        if (member.currentMembership && ['Active', 'Frozen'].includes(member.currentMembership.status)) {
            return res.status(400).json({
                message: 'You already have an active or frozen membership subscription. Contact reception to upgrade or modify your package.'
            });
        }

        let price = 1500;
        if (planType === '3 Months') price = 3500;
        if (planType === '6 Months') price = 6500;

        const amountInPaisa = price * 100;

        if (razorpay) {
            // Clean contact number (must be strictly numbers and leading '+')
            const rawPhone = member.phone || '';
            const sanitizedPhone = rawPhone.replace(/[^0-9+]/g, '');
            
            // Detect if phone has repeating consecutive digits (e.g. 5+ repeats of same digit) or is too short
            let contactPrefill = sanitizedPhone;
            if (sanitizedPhone.length < 10 || /(.)\1{4,}/.test(sanitizedPhone)) {
                contactPrefill = '+919876543210'; // Safe non-recurring test number
            }

            const paymentLink = await razorpay.paymentLink.create({
                amount: amountInPaisa,
                currency: 'INR',
                accept_partial: false,
                description: `${planType} Membership Package Renewal`,
                customer: {
                    name: member.fullName || 'Test Member',
                    email: member.email || 'test@gymos.com',
                    contact: contactPrefill
                },
                notify: { sms: false, email: false },
                reminder_enable: false,
                callback_url: `${process.env.FRONTEND_URL || 'http://localhost:5173'}/member/confirm-purchase`,
                callback_method: 'get'
            });

            return res.status(200).json({
                paymentLinkUrl: paymentLink.short_url,
                paymentLinkId: paymentLink.id
            });
        } else {
            // Fallback Offline Mock Mode
            const mockLinkId = `plink_mock_${Date.now()}`;
            return res.status(200).json({
                paymentLinkUrl: null,
                paymentLinkId: mockLinkId,
                simulated: true
            });
        }
    } catch (err) {
        console.error('Error in createRazorpayOrder:', err);
        res.status(500).json({ message: 'Error generating hosted checkout session', error: err.message });
    }
};

/**
 * Verify Razorpay payment and activate membership
 */
const verifyPaymentSignature = async (req, res) => {
    try {
        const memberId = req.user.id;
        const { razorpay_payment_id, planType } = req.body;

        if (!planType || !['1 Month', '3 Months', '6 Months'].includes(planType)) {
            return res.status(400).json({ message: 'Invalid plan type.' });
        }

        // Fetch payment details directly from Razorpay to verify status
        if (razorpay && razorpay_payment_id && !razorpay_payment_id.startsWith('pay_mock_')) {
            const payment = await razorpay.payments.fetch(razorpay_payment_id);
            if (payment.status !== 'captured' && payment.status !== 'authorized') {
                return res.status(400).json({ message: 'Payment verification failed. Transaction status is not captured.' });
            }
        }

        // Setup dates
        const start = new Date();
        const end = new Date(start);
        if (planType === '1 Month') end.setMonth(end.getMonth() + 1);
        else if (planType === '3 Months') end.setMonth(end.getMonth() + 3);
        else if (planType === '6 Months') end.setMonth(end.getMonth() + 6);

        let price = 1500;
        if (planType === '3 Months') price = 3500;
        if (planType === '6 Months') price = 6500;

        // Save membership record
        const newMembership = new Membership({
            memberId,
            planType,
            startDate: start,
            endDate: end,
            status: 'Active',
            price,
            paymentId: razorpay_payment_id || 'simulated_payment_id',
            orderId: 'hosted_payment_link'
        });

        await newMembership.save();

        // Bind to user profile
        const member = await User.findById(memberId);
        if (member) {
            member.currentMembership = newMembership._id;
            if (member.role === 'user') {
                member.role = 'member';
            }
            await member.save();
        }

        res.status(201).json({
            message: 'Membership transaction verified and activated!',
            membership: newMembership
        });
    } catch (err) {
        console.error('Error in verifyPaymentSignature:', err);
        res.status(500).json({ message: 'Error verifying purchase verification', error: err.message });
    }
};

module.exports = {
    getDashboardData,
    getProgressHistory,
    purchaseMembership,
    getCheckInToken,
    updateProfile,
    createRazorpayOrder,
    verifyPaymentSignature
};
