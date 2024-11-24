const jwt = require('jsonwebtoken');

// Middleware to authenticate token
const authenticateToken = (req, res, next) => {
    // Get the token from the Authorization header
    const authHeader = req.headers['authorization'];
    const token = authHeader && authHeader.split(' ')[1];

    // If no token, return unauthorized
    if (!token) {
        return res.status(401).json({ message: 'Access Denied: No token provided' });
    }

    // Verify token
    jwt.verify(token, process.env.JWT_SECRET, (err, user) => {
        if (err) {
            return res.status(403).json({ message: 'Invalid Token' });
        }

        // Attach user object to request
        req.user = user;
        next();
    });
};

module.exports = authenticateToken;
