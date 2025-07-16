const express = require("express");
const { generateItemSummary } = require("../services/Gemini") 

const router = express.Router();

router.post("/generate-item-summary", async (req, res) => {
  const { section, item } = req.body;

  try {
    const summary = await generateItemSummary({ section, item });
    res.json({ summary });
  } catch (err) {
    console.error("Item summary generation error:", err.message);
    res.status(500).json({ error: "Failed to generate item summary" });
  }
});

module.exports = router; 
