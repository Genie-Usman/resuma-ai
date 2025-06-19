const express = require("express");
const { registerUser, loginUser, getUserProfile } = require("../controllers/authController");
const { protect } = require("../middlewares/authMiddleware");
const upload = require("../middlewares/uploadMiddleware");

const router = express.Router();

// Auth Routes
router.post("/register", registerUser);                  //Register User
router.post("/login", loginUser);                        //Login User
router.get("/profile", protect, getUserProfile);         //Get User Profile

// Upload Image Route
router.post("/upload-image", upload.single("image"), (req, res) => {
    if (!req.file) {
        return res.status(400).json({ message: "No Image uploaded" });
    }

    const imageURL = `${req.protocol}://${req.get("host")}/uploads/${req.file.filename}`;
    res.status(200).json({ imageURL });
})

module.exports = router;