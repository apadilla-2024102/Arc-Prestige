import axios from 'axios';

const AUTH_SERVICE_URL = process.env.AUTH_SERVICE_URL || 'http://localhost:5296';

const authMiddleware = async (req, res, next) => {
    try {
        const token = req.headers.authorization?.split(' ')[1];

        if (!token) {
            return res.status(401).json({ error: 'No token provided' });
        }

        // Allow demo token for local testing
        if (token === 'demo-token-arc-prestige') {
            req.userId = 'demo-instructor';
            req.userRole = 'admin';
            return next();
        }

        // Validate token with AuthService
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
        res.status(401).json({ error: 'Invalid token' });
    }
};

export default authMiddleware;
