const User = require('../models/User');
const OTP = require('../models/OTP');
const jwt = require('jsonwebtoken');
const { generateAccessToken, generateRefreshToken } = require('../utils/jwt');

/**
 * Helper to set the refresh token HTTP-only cookie on a response.
 */
const setRefreshTokenCookie = (res, token) => {
    res.cookie('refreshToken', token, {
        httpOnly: true,
        secure: process.env.NODE_ENV === 'production',
        sameSite: 'lax',
        maxAge: 7 * 24 * 60 * 60 * 1000 // 7 days in milliseconds
    });
};

/**
 * Register a new user
 */
const register = async (req, res) => {
    try {
        const { fullName, email, password, phone, emergencyContact, fitnessGoals, medicalNotes, role } = req.body;

        // Check if email has been verified via OTP
        const verifiedOtp = await OTP.findOne({ email, verified: true, otpType: 'newUser' });
        if (!verifiedOtp) {
            return res.status(400).json({ message: 'Email address has not been verified via OTP. Please verify your email first.' });
        }

        // Check if user already exists
        const existingUser = await User.findOne({ email });
        if (existingUser) {
            return res.status(400).json({ message: 'User already exists with this email' });
        }

        // Create new user (role defaults to 'user' if not provided or empty)
        const user = new User({
            fullName,
            email,
            password,
            phone,
            emergencyContact,
            fitnessGoals,
            medicalNotes,
            role: role || undefined
        });

        await user.save();

        // Delete the temporary verification record to prevent reuse
        await OTP.deleteMany({ email });

        const accessToken = generateAccessToken(user);
        const refreshToken = generateRefreshToken(user);

        setRefreshTokenCookie(res, refreshToken);

        res.status(201).json({
            message: 'User registered successfully',
            accessToken,
            user: {
                id: user._id,
                fullName: user.fullName,
                email: user.email,
                role: user.role
            }
        });
    } catch (err) {
        console.error('Error in register:', err);
        res.status(500).json({ message: 'Server error during registration', error: err.message });
    }
};

/**
 * Log in an existing user
 */
const login = async (req, res) => {
    try {
        const { email, password } = req.body;

        if (!email || !password) {
            return res.status(400).json({ message: 'Email and password are required' });
        }

        // Find user by email
        const user = await User.findOne({ email });
        if (!user) {
            return res.status(400).json({ message: 'Invalid credentials' });
        }

        // Validate password
        const isMatch = await user.comparePassword(password);
        if (!isMatch) {
            return res.status(400).json({ message: 'Invalid credentials' });
        }

        const accessToken = generateAccessToken(user);
        const refreshToken = generateRefreshToken(user);

        setRefreshTokenCookie(res, refreshToken);

        res.status(200).json({
            message: 'Login successful',
            accessToken,
            user: {
                id: user._id,
                fullName: user.fullName,
                email: user.email,
                role: user.role
            }
        });
    } catch (err) {
        console.error('Error in login:', err);
        res.status(500).json({ message: 'Server error during login', error: err.message });
    }
};

/**
 * Get a new access token using a valid refresh token cookie
 */
const refresh = async (req, res) => {
    try {
        const refreshToken = req.cookies.refreshToken;

        if (!refreshToken) {
            return res.status(401).json({ message: 'Refresh token required' });
        }

        // Verify refresh token
        jwt.verify(refreshToken, process.env.REFRESH_TOKEN_SECRET || 'default_refresh_secret_key_67890', async (err, decoded) => {
            if (err) {
                return res.status(403).json({ message: 'Invalid or expired refresh token' });
            }

            const user = await User.findById(decoded.id);
            if (!user) {
                return res.status(404).json({ message: 'User no longer exists' });
            }

            const accessToken = generateAccessToken(user);
            res.status(200).json({ accessToken, role: user.role });
        });
    } catch (err) {
        console.error('Error in refresh:', err);
        res.status(500).json({ message: 'Server error during token refresh', error: err.message });
    }
};

/**
 * Log out a user and clear their refresh token cookie
 */
const logout = (req, res) => {
    res.clearCookie('refreshToken', {
        httpOnly: true,
        secure: process.env.NODE_ENV === 'production',
        sameSite: 'strict'
    });
    res.status(200).json({ message: 'Logged out successfully' });
};

/**
 * Get profile of current logged-in user
 */
const getMe = async (req, res) => {
    try {
        const user = await User.findById(req.user.id).select('-password');
        if (!user) {
            return res.status(404).json({ message: 'User not found' });
        }
        res.status(200).json({ user });
    } catch (err) {
        console.error('Error in getMe:', err);
        res.status(500).json({ message: 'Server error fetching user profile', error: err.message });
    }
};

/**
 * Request Password Reset Code (Forgot Password)
 */
const forgotPassword = async (req, res) => {
    try {
        const { email } = req.body;
        if (!email) {
            return res.status(400).json({ message: 'Email address is required' });
        }

        // Verify user exists
        const user = await User.findOne({ email });
        if (!user) {
            return res.status(404).json({ message: 'No registered user found with this email address.' });
        }

        const crypto = require('crypto');
        const nodemailer = require('nodemailer');
        const otp = crypto.randomInt(100000, 999999).toString();

        // Clear any old reset OTP records for this email
        await OTP.deleteMany({ email, otpType: 'resetPassword' });

        // Save new reset OTP record
        const otpRecord = new OTP({
            email,
            otp,
            otpType: 'resetPassword',
            verified: false
        });
        await otpRecord.save();

        // Nodemailer dispatch setup
        const createTransporter = () => {
            if (process.env.NODE_ENV === 'production') return null;
            if (!process.env.SMTP_USER || !process.env.SMTP_PASS) return null;
            return nodemailer.createTransport({
                host: process.env.SMTP_HOST || 'smtp.gmail.com',
                port: parseInt(process.env.SMTP_PORT || '587', 10),
                secure: false,
                auth: { user: process.env.SMTP_USER, pass: process.env.SMTP_PASS }
            });
        };

        const transporter = createTransporter();

        if (transporter) {
            const mailOptions = {
                from: `"gymOS Authentication" <${process.env.SMTP_USER}>`,
                to: email,
                subject: 'Your gymOS Password Reset Verification Code',
                text: `Hello! Your one-time password reset code is: ${otp}. This code is valid for 5 minutes.`,
                html: `
                    <div style="font-family: 'Manrope', sans-serif; padding: 20px; border: 1px solid #e6e6e6; border-radius: 8px; max-width: 500px; color: #1a1a1a;">
                        <h2 style="text-transform: uppercase; font-weight: 900; letter-spacing: -1px; margin-bottom: 20px;">S/ gymOS Auth</h2>
                        <p>You requested a password reset. Use the following verification code to reset your account password:</p>
                        <div style="background-color: #f2f2f2; font-size: 32px; font-weight: 800; text-align: center; padding: 15px; border-radius: 4px; letter-spacing: 5px; margin: 25px 0;">
                            ${otp}
                        </div>
                        <p style="font-size: 13px; color: #949494;">This code is valid for 5 minutes. If you did not make this request, please ignore this email.</p>
                    </div>
                `
            };
            await transporter.sendMail(mailOptions);
            res.status(200).json({ message: 'Password reset code emailed successfully.', otp });
        } else {
            console.log('\n====================================');
            console.log(`[SMTP OFFLINE] Password Reset OTP for ${email}: ${otp}`);
            console.log('====================================\n');
            res.status(200).json({ 
                message: 'Password reset code logged to server console (Mock Transmit).',
                mockMode: true,
                otp
            });
        }
    } catch (err) {
        console.error('Error in forgotPassword:', err);
        res.status(500).json({ message: 'Error sending reset code', error: err.message });
    }
};

/**
 * Verify OTP code and reset password
 */
const resetPassword = async (req, res) => {
    try {
        const { email, otp, newPassword } = req.body;
        if (!email || !otp || !newPassword) {
            return res.status(400).json({ message: 'Email, code, and new password are required' });
        }

        // Verify OTP matches and is not expired
        const record = await OTP.findOne({ email, otpType: 'resetPassword' });
        if (!record) {
            return res.status(400).json({ message: 'No password reset request found for this email.' });
        }

        // 5-minute expiry validation check
        if (new Date() > record.otpExpiresAt) {
            return res.status(400).json({ message: 'Verification code has expired. Please request a new one.' });
        }

        if (record.otp !== otp) {
            return res.status(400).json({ message: 'Invalid verification code. Please check your entry.' });
        }

        // Load user and update password (Mongoose pre-save hook handles hashing)
        const user = await User.findOne({ email });
        if (!user) {
            return res.status(404).json({ message: 'User not found.' });
        }

        user.password = newPassword;
        await user.save();

        // Delete all OTP entries for this email
        await OTP.deleteMany({ email });

        res.status(200).json({ message: 'Password reset successful! You may now sign in with your new credentials.' });
    } catch (err) {
        console.error('Error in resetPassword:', err);
        res.status(500).json({ message: 'Error resetting password', error: err.message });
    }
};

module.exports = {
    register,
    login,
    refresh,
    logout,
    getMe,
    forgotPassword,
    resetPassword
};
