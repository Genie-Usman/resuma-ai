const express = require("express");
const {
  generateItemSummary,
  analyzeJobMatch,
  improveBulletPoint,
} = require("../services/Gemini");
const { geminiLimiter } = require("../middlewares/rateLimiter");
const { validateRequest } = require("../middlewares/validateMiddleware");
const {
  generateSummarySchema,
  jobMatchSchema,
  improveBulletSchema,
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

module.exports = router;
