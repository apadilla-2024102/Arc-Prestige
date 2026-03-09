const axios = require('axios');

const authMiddleware = async (req, res, next) => {
    try {
        const token = req.headers.authorization?.split(' ')[1];

        if (!token) {
            return res.status(401).json({ error: 'No token provided' });
        }

        // Validar token con AuthService
        const response = await axios.post(
            `${process.env.AUTH_SERVICE_URL}/api/auth/validate-token`,
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

module.exports = authMiddleware;
