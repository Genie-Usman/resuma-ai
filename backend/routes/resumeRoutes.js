const express = require("express");
const {
  createResume,
  getUserResumes,
  getResumeById,
  updateResume,
  deleteResume,
  duplicateResume,
  getPublicResume,
  exportResumePdf,
  exportPublicResumePdf,
} = require("../controllers/resumeController");

const { uploadResumeImages } = require("../controllers/uploadImages");
const { protect } = require("../middlewares/authMiddleware");
const upload = require("../middlewares/uploadMiddleware"); // ← this

const { validateRequest } = require("../middlewares/validateMiddleware");
const { createResumeSchema, updateResumeSchema } = require("../validators/resumeValidator");

const router = express.Router();

// Public Resume Routes (Unauthenticated Recruiter View & PDF Export)
router.get("/public/:slug", getPublicResume);
router.get("/public/:slug/export-pdf", exportPublicResumePdf);

// Core Protected Resume Routes
router.post("/", protect, validateRequest(createResumeSchema), createResume);
router.get("/", protect, getUserResumes);
router.get("/:id", protect, getResumeById);
router.get("/:id/export-pdf", protect, exportResumePdf);
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