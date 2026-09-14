const express = require("express");
const {
  generateItemSummary,
  analyzeJobMatch,
  improveBulletPoint,
  auditResume,
  generateCoverLetter,
} = require("../services/Gemini");
const { geminiLimiter } = require("../middlewares/rateLimiter");
const { validateRequest } = require("../middlewares/validateMiddleware");
const {
  generateSummarySchema,
  jobMatchSchema,
  improveBulletSchema,
  resumeAuditSchema,
  generateCoverLetterSchema,
} = require("../validators/geminiValidator");

const router = express.Router();

// Generate Item Summary
router.post(
  "/generate-item-summary",
  geminiLimiter,
  validateRequest(generateSummarySchema),
  async (req, res) => {
    const { section, item, tone } = req.body;

    try {
      const summary = await generateItemSummary({ section, item, tone });
      res.json({ summary });
    } catch (err) {
      console.error("Item summary generation error:", err.message);
      res.status(500).json({ error: "Failed to generate item summary" });
    }
  }
);

// Analyze Job Description Match (ATS Scoring & Keyword Recommendations)
router.post(
  "/job-match",
  geminiLimiter,
  validateRequest(jobMatchSchema),
  async (req, res) => {
    const { jobDescription, resumeData } = req.body;

    try {
      const analysis = await analyzeJobMatch({ jobDescription, resumeData });
      res.json(analysis);
    } catch (err) {
      console.error("Job match analysis error:", err.message);
      res.status(500).json({ error: "Failed to analyze job match. Please try again." });
    }
  }
);

// Improve Bullet Point using Google XYZ formula & tone
router.post(
  "/improve-bullet-point",
  geminiLimiter,
  validateRequest(improveBulletSchema),
  async (req, res) => {
    const { text, tone, context } = req.body;

    try {
      const result = await improveBulletPoint({ text, tone, context });
      res.json(result);
    } catch (err) {
      console.error("Improve bullet point error:", err.message);
      res.status(500).json({ error: "Failed to improve bullet point. Please try again." });
    }
  }
);

// Comprehensive Resume & ATS Audit
router.post(
  "/resume-audit",
  geminiLimiter,
  validateRequest(resumeAuditSchema),
  async (req, res) => {
    const { resumeData, targetRole } = req.body;

    try {
      const audit = await auditResume({ resumeData, targetRole });
      res.json(audit);
    } catch (err) {
      console.error("Resume audit error:", err.message);
      res.status(500).json({ error: "Failed to audit resume. Please try again." });
    }
  }
);

// Generate Matched Cover Letter (Roadmap Item 4.4)
router.post(
  "/generate-cover-letter",
  geminiLimiter,
  validateRequest(generateCoverLetterSchema),
  async (req, res) => {
    const {
      jobDescription,
      companyName,
      targetCompany,
      jobTitle,
      targetJobTitle,
      tone,
      resumeData,
    } = req.body;

    try {
      const coverLetter = await generateCoverLetter({
        jobDescription,
        companyName: companyName || targetCompany || "",
        jobTitle: jobTitle || targetJobTitle || "",
        tone: tone || "impactful",
        resumeData: resumeData || {},
      });
      res.json({ coverLetter, ...coverLetter });
    } catch (err) {
      console.error("Cover letter generation error:", err);
      res.status(500).json({ error: err.message || "Failed to generate cover letter. Please try again." });
    }
  }
);

module.exports = router;
