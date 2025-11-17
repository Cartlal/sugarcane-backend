const express = require("express");
const router = express.Router();

// Safe dynamic import for node-fetch
const fetch = (...args) =>
  import("node-fetch").then(({ default: fetch }) => fetch(...args));

// Your working proxy URL
const OPENAI_PROXY = "http://openai-proxy-1-hhfb.onrender.com/openai";

router.post("/advice", async (req, res) => {
  try {
    const { pestDetected, language } = req.body;

    if (!pestDetected) {
      return res
        .status(400)
        .json({ error: "pestDetected field is required" });
    }

    // The multilingual, simple-language safe prompt
    const prompt = `
You are an agricultural expert specializing in sugarcane crop health.
The detected issue on the sugarcane leaf is: ${pestDetected}.

Write a simple, clear, 6–10 point farming advisory in ${language || "English"}.

Rules:
- Use plain text only. No symbols, no Markdown.
- Each point must start with: 1. 2. 3. etc.
- Each point must be short and practical.
- No technical or scientific jargon.
- Use easy rural-friendly words.
- Only one language: ${language}.
- Include:
  - What the issue is
  - Causes
  - Symptoms
  - Low-cost treatment
  - Preventive measures
  - Useful farmer tips
`;

    // Call OpenAI proxy
    const response = await fetch(OPENAI_PROXY, {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ message: prompt }),
    });

    // Read raw text (NOT JSON yet)
    const rawText = await response.text();

    // If HTML returned, stop immediately (prevents crash)
    if (rawText.startsWith("<") || rawText.includes("<html")) {
      console.error("❌ Proxy returned HTML instead of JSON");
      return res
        .status(500)
        .json({ error: "AI service returned invalid response (HTML)" });
    }

    // Try parsing JSON safely
    let data;
    try {
      data = JSON.parse(rawText);
    } catch (err) {
      console.error("❌ JSON parse error:", err);
      return res.status(500).json({
        error: "AI service returned malformed JSON",
        raw: rawText,
      });
    }

    // Extract AI text safely
    let aiText =
      data.reply ||
      data.response ||
      data.output ||
      data.text ||
      data.choices?.[0]?.message?.content ||
      data.choices?.[0]?.text ||
      null;

    if (!aiText) {
      return res.status(500).json({
        error: "AI returned no valid response",
        raw: data,
      });
    }

    // Clean unwanted characters
    aiText = aiText
      .replace(/\*/g, "")
      .replace(/[>#_`~]/g, "")
      .replace(/\r/g, "")
      .replace(/\n\s*\n/g, "\n") // remove double newlines
      .trim();

    res.json({ advice: aiText });
  } catch (err) {
    console.error("❌ /advice error:", err);
    res.status(500).json({ error: err.message });
  }
});

module.exports = router;
