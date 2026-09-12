const express = require("express");
const {
    registerUser,
    loginUser,
    logoutUser,
    getUserProfile,
    googleAuth,
    googleCallback,
    linkedinAuth,
    linkedinCallback,
} = require("../controllers/authController");
const { protect } = require("../middlewares/authMiddleware");
const upload = require("../middlewares/uploadMiddleware");
const { authLimiter } = require("../middlewares/rateLimiter");
const { validateRequest } = require("../middlewares/validateMiddleware");
const { registerSchema, loginSchema } = require("../validators/authValidator");
const { uploadMedia } = require("../config/cloudinary");

const router = express.Router();

// Auth Routes with Rate Limiting and Zod Validation
router.post("/register", authLimiter, validateRequest(registerSchema), registerUser);
router.post("/login", authLimiter, validateRequest(loginSchema), loginUser);
router.post("/logout", logoutUser);
router.get("/profile", protect, getUserProfile);

// Google OAuth 2.0 Routes
router.get("/google", googleAuth);
router.get("/google/callback", googleCallback);

// LinkedIn OAuth 2.0 (OpenID Connect) Routes
router.get("/linkedin", linkedinAuth);
router.get("/linkedin/callback", linkedinCallback);

// Upload Image Route (Cloudinary with Local Fallback)
router.post("/upload-image", upload.single("image"), async (req, res) => {
    try {
        if (!req.file) {
            return res.status(400).json({ message: "No Image uploaded" });
        }

        const imageUrl = await uploadMedia(
            req.file.buffer,
            req.file.originalname || "profile.png",
            req,
            { folder: "resuma_ai/avatars" }
        );

        res.status(200).json({ imageUrl });
    } catch (error) {
        console.error("Profile image upload failed:", error);
        res.status(500).json({ message: "Image upload failed", error: error.message });
    }
});

module.exports = router;