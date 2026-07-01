/**
 * Middleware to restrict route access to specific roles.
 * Must be used after authMiddleware has successfully verified user token and populated req.user.
 * 
 * @param {...string} roles - The list of allowed roles.
 */
const authorizeRoles = (...roles) => {
    return (req, res, next) => {
        if (!req.user || !req.user.role) {
            return res.status(401).json({ message: 'Unauthorized: Authentication required' });
        }

        if (!roles.includes(req.user.role)) {
            return res.status(403).json({ message: `Forbidden: role '${req.user.role}' does not have access to this resource` });
        }

        next();
    };
};

module.exports = authorizeRoles;
