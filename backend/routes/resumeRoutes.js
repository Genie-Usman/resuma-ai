const express = require("express");
const {
  createResume,
  getUserResumes,
  getResumeById,
  updateResume,
  deleteResume,
  duplicateResume,
  getPublicResume,
  unlockPublicResume,
  updateResumeSlug,
  updateResumeProtection,
  getResumeAnalytics,
  exportResumePdf,
  exportPublicResumePdf,
  exportResumeDocx,
  exportPublicResumeDocx,
} = require("../controllers/resumeController");

const { uploadResumeImages } = require("../controllers/uploadImages");
const { protect } = require("../middlewares/authMiddleware");
const upload = require("../middlewares/uploadMiddleware"); // ← this

const { validateRequest } = require("../middlewares/validateMiddleware");
const { createResumeSchema, updateResumeSchema } = require("../validators/resumeValidator");

const router = express.Router();

// Public Resume Routes (Unauthenticated Recruiter View, PDF Export & Unlock)
router.get("/public/:slug", getPublicResume);
router.post("/public/:slug/unlock", unlockPublicResume);
router.get("/public/:slug/export-pdf", exportPublicResumePdf);
router.get("/public/:slug/export-docx", exportPublicResumeDocx);

// Core Protected Resume Routes
router.post("/", protect, validateRequest(createResumeSchema), createResume);
router.get("/", protect, getUserResumes);
router.get("/:id", protect, getResumeById);
router.get("/:id/analytics", protect, getResumeAnalytics);
router.put("/:id/slug", protect, updateResumeSlug);
router.put("/:id/protection", protect, updateResumeProtection);
router.get("/:id/export-pdf", protect, exportResumePdf);
router.get("/:id/export-docx", protect, exportResumeDocx);
router.post("/:id/duplicate", protect, duplicateResume);
router.put("/:id", protect, validateRequest(updateResumeSchema), updateResume);
router.delete("/:id", protect, deleteResume);

// File Upload Route with Multer Middleware
router.put(
  "/:id/upload-images",
  protect,
  upload.fields([
    { name: "thumbnail", maxCount: 1 },
    { name: "profileImage", maxCount: 1 }
  ]),
  uploadResumeImages
);

module.exports = router;