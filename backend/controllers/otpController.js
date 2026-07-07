const crypto = require('crypto');
const nodemailer = require('nodemailer');
const OTP = require('../models/OTP');
const User = require('../models/User');

/**
 * Configure Nodemailer SMTP Transporter
 */
const createTransporter = () => {
    if (process.env.NODE_ENV === 'production') {
        return null;
    }

    if (!process.env.SMTP_USER || !process.env.SMTP_PASS) {
        return null;
    }

    return nodemailer.createTransport({
        host: process.env.SMTP_HOST || 'smtp.gmail.com',
        port: parseInt(process.env.SMTP_PORT || '587', 10),
        secure: false,
        auth: {
            user: process.env.SMTP_USER,
            pass: process.env.SMTP_PASS
        }
    });
};

/**
 * Generate and dispatch OTP to user's email for registration
 */
const sendOTP = async (req, res) => {
    try {
        const { email } = req.body;
        if (!email) {
            return res.status(400).json({ message: 'Email address is required' });
        }

        const existingUser = await User.findOne({ email });
        if (existingUser) {
            return res.status(400).json({ message: 'A user account with this email already exists.' });
        }

        const otp = crypto.randomInt(100000, 999999).toString();

        // Clear any old registration OTP records for this email
        await OTP.deleteMany({ email, otpType: 'newUser' });

        // Save new OTP record
        const otpRecord = new OTP({
            email,
            otp,
            otpType: 'newUser',
            verified: false
        });
        await otpRecord.save();

        const transporter = createTransporter();

        if (transporter) {
            const mailOptions = {
                from: `"gymOS Authentication" <${process.env.SMTP_USER}>`,
                to: email,
                subject: 'Your gymOS Registration Verification Code',
                text: `Hello! Your one-time verification code is: ${otp}. This code is valid for 5 minutes.`,
                html: `
                    <div style="font-family: 'Manrope', sans-serif; padding: 20px; border: 1px solid #e6e6e6; border-radius: 8px; max-width: 500px; color: #1a1a1a;">
                        <h2 style="text-transform: uppercase; font-weight: 900; letter-spacing: -1px; margin-bottom: 20px;">S/ gymOS Auth</h2>
                        <p>Welcome to the Strength Laboratory. To verify your email address and continue registration, use the following verification code:</p>
                        <div style="background-color: #f2f2f2; font-size: 32px; font-weight: 800; text-align: center; padding: 15px; border-radius: 4px; letter-spacing: 5px; margin: 25px 0;">
                            ${otp}
                        </div>
                        <p style="font-size: 13px; color: #949494;">This code is valid for 5 minutes. The document will remain in database logs for 24 hours.</p>
                    </div>
                `
            };

            await transporter.sendMail(mailOptions);
            res.status(200).json({ message: 'Verification code emailed successfully.' });
        } else {
            console.log('\n====================================');
            console.log(`[SMTP OFFLINE] Registration OTP for ${email}: ${otp}`);
            console.log('====================================\n');
            res.status(200).json({ 
                message: 'Verification code logged to server console (Mock Transmit).',
                mockMode: true 
            });
        }
    } catch (err) {
        console.error('Error in sendOTP:', err);
        res.status(500).json({ message: 'Error sending verification code', error: err.message });
    }
};

/**
 * Validate submitted registration OTP and mark as verified
 */
const verifyOTP = async (req, res) => {
    try {
        const { email, otp } = req.body;
        if (!email || !otp) {
            return res.status(400).json({ message: 'Email and verification code are required' });
        }

        const record = await OTP.findOne({ email, otpType: 'newUser' });
        if (!record) {
            return res.status(400).json({ message: 'No registration verification request found for this email.' });
        }

        // Verify if OTP has expired (5-minute programmatic check)
        if (new Date() > record.otpExpiresAt) {
            return res.status(400).json({ message: 'Verification code has expired. Please request a new one.' });
        }

        if (record.otp !== otp) {
            return res.status(400).json({ message: 'Invalid verification code. Please check your entry.' });
        }

        record.verified = true;
        await record.save();

        res.status(200).json({ message: 'Email verified successfully. You may proceed with registration.' });
    } catch (err) {
        console.error('Error in verifyOTP:', err);
        res.status(500).json({ message: 'Error verifying code', error: err.message });
    }
};

module.exports = {
    sendOTP,
    verifyOTP
};
