const User = require('../models/User');
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
        res.status(500).json({ message: 'Server error fetching user profile', error: err.message });
    }
};

module.exports = {
    register,
    login,
    refresh,
    logout,
    getMe
};
