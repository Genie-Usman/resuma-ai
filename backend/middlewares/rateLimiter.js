const rateLimit = require("express-rate-limit");

// Limiter for authentication endpoints (prevent brute-force attacks)
const authLimiter = rateLimit({
    windowMs: 15 * 60 * 1000, // 15 minutes
    max: 20, // Limit each IP to 20 requests per window
    standardHeaders: true, // Return rate limit info in `RateLimit-*` headers
    legacyHeaders: false, // Disable `X-RateLimit-*` headers
    message: {
        message: "Too many attempts from this IP, please try again after 15 minutes."
    }
});

// Limiter for Gemini AI generation endpoints (protect API quotas and budget)
const geminiLimiter = rateLimit({
    windowMs: 60 * 1000, // 1 minute
    max: 30, // Limit each IP to 30 requests per minute
    standardHeaders: true,
    legacyHeaders: false,
    message: {
        message: "AI rate limit reached. Please wait a moment before generating more summaries."
    }
});

// General API limiter
const apiLimiter = rateLimit({
    windowMs: 15 * 60 * 1000, // 15 minutes
    max: 300,
    standardHeaders: true,
    legacyHeaders: false,
    message: {
        message: "Too many requests from this IP, please try again later."
    }
});

module.exports = {
    authLimiter,
    geminiLimiter,
    apiLimiter
};
