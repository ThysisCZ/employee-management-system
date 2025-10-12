const jwt = require('jsonwebtoken');

const JWT_SECRET = 'your-secret-key-change-this-in-production';

module.exports.authenticateToken = (req, res, next) => {
    // Get token from Authorization header
    const authHeader = req.headers['authorization'];
    const token = authHeader && authHeader.split(' ')[1]; // Format: "Bearer TOKEN"

    if (!token) {
        return res.status(401).send({ success: false, message: 'Access token required' });
    }

    try {
        // Verify token
        const decoded = jwt.verify(token, JWT_SECRET);

        // Attach manager info to request
        req.manager = decoded;

        // Continue to next middleware/controller
        next();
    } catch (e) {
        return res.status(403).send({ success: false, message: 'Invalid or expired token' });
    }
};