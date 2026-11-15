const jwt = require('jsonwebtoken');

const verifyToken = (req, res, next) => {
    const authHeader = req.header['authorization'];
    const token = authHeader && authHeader.split(' ')[1];

    if (!token) {
        return res.status(401).json({message: 'Access denied. No token provided.'});
    }

    try {
        const verified = jwt.verify(token, process.env.JWT_SECRET);
        req.user = verified;
        next();
    } catch (err) {
        return res.status(403).json({message: 'Invalid or expired token.'});
    }
};

const verifyAdmin = (req, res, next) => {
    if (req.user && req.user.role === 'admin') {
        next();
    } else {
        return res.status(403).json({message: 'Access denied. Admin privileges required.'});
    }
};

module.exports = {
    verifyToken,
    verifyAdmin
};