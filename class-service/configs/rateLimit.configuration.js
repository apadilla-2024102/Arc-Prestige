import rateLimit from 'express-rate-limit';

export const requestLimit = rateLimit({
    windowMs: 15 * 60 * 1000, // 15 minutes
    max: 100, // limit each IP to 100 requests per windowMs
    standardHeaders: true,
    handler: (req, res) => {
        console.log(`Rate limit exceeded from IP: ${req.ip}, Endpoint: ${req.path}`);
        res.status(429).json({
            success: false,
            message: 'Too many requests from this IP, please try again later',
            error: 'RATE_LIMIT_EXCEEDED',
            retryAfter: Math.round((req.rateLimit.resetTime - Date.now()) / 1000)
        });
    }
});