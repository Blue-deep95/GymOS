const jwt = require('jsonwebtoken');

/**
 * Middleware to authenticate requests using a short-lived access token.
 * Access token is expected in the Authorization header as "Bearer <token>".
 */
const authMiddleware = (req, res, next) => {
    const authHeader = req.headers['authorization'];
    const token = authHeader && authHeader.split(' ')[1]; // Extract token from "Bearer <token>"

    if (!token) {
        return res.status(401).json({ message: 'Access token required' });
    }

    try {
        const decoded = jwt.verify(token, process.env.ACCESS_TOKEN_SECRET || 'default_access_secret_key_12345');
        req.user = decoded; // Contains user ID (decoded.id) and role (decoded.role)
        next();
    } catch (err) {
        return res.status(401).json({ message: 'Invalid or expired access token' });
    }
};

module.exports = authMiddleware;
