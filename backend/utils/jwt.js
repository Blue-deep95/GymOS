const jwt = require('jsonwebtoken');

/**
 * Generates an Access Token containing user ID and role.
 * Expires in 15 minutes.
 */
const generateAccessToken = (user) => {
    return jwt.sign(
        { id: user._id, role: user.role },
        process.env.ACCESS_TOKEN_SECRET || 'default_access_secret_key_12345',
        { expiresIn: '15m' }
    );
};

/**
 * Generates a Refresh Token containing user ID and role.
 * Expires in 7 days.
 */
const generateRefreshToken = (user) => {
    return jwt.sign(
        { id: user._id, role: user.role },
        process.env.REFRESH_TOKEN_SECRET || 'default_refresh_secret_key_67890',
        { expiresIn: '7d' }
    );
};

module.exports = {
    generateAccessToken,
    generateRefreshToken
};
