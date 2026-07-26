const axios = require('axios');
const AUTH_SERVICE_URL = process.env.AUTH_SERVICE_URL || 'http://localhost:5296';
const DEMO_TOKEN = process.env.DEMO_TOKEN || 'demo-token-arc-prestige';

const authMiddleware = async (req, res, next) => {
    try {
        const token = req.headers.authorization?.split(' ')[1];

        if (!token) {
            return res.status(401).json({ error: 'No token provided' });
        }

        if (token === DEMO_TOKEN) {
            req.userId = 'demo-user';
            req.userRole = 'admin';
            return next();
        }

        const response = await axios.post(
            `${AUTH_SERVICE_URL}/api/v1/auth/validate-token`,
            {},
            {
                headers: { Authorization: `Bearer ${token}` },
            }
        );

        req.userId = response.data.userId;
        req.userRole = response.data.role;
        next();
    } catch (error) {
        if (req.headers.authorization?.includes(DEMO_TOKEN)) {
            req.userId = 'demo-user';
            req.userRole = 'admin';
            return next();
        }

        res.status(401).json({ error: 'Invalid token' });
    }
};

module.exports = authMiddleware;
