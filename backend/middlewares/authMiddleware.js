const jwt = require("jsonwebtoken");
const User = require("../models/User");

// Middleware to protect routes (supports HttpOnly cookies & Bearer tokens)
const protect = async (req, res, next) => {
    try {
        let token = req.cookies?.token;

        // Fallback to Bearer token in Authorization header for API tools & curl
        if (!token && req.headers.authorization && req.headers.authorization.startsWith("Bearer")) {
            token = req.headers.authorization.split(" ")[1];
        }

        if (!token) {
            return res.status(401).json({ message: "Not Authorized, no token" });
        }

        const decoded = jwt.verify(token, process.env.JWT_SECRET);
        req.user = await User.findById(decoded.id).select("-password");

        if (!req.user) {
            return res.status(401).json({ message: "Not Authorized, user not found" });
        }

        next();
    } catch (error) {
        res.status(401).json({ message: "Token failed or expired", error: error.message });
    }
};

module.exports = { protect };