const express = require("express");
const fetch = (...args) =>
  import("node-fetch").then(({ default: fetch }) => fetch(...args));
const router = express.Router();

// ✅ Use your working proxy
const OPENAI_PROXY = "http://openai-proxy-1-hhfb.onrender.com/openai";

router.post("/advice", async (req, res) => {
  try {
    const { pestDetected, language } = req.body;

    if (!pestDetected) {
      return res.status(400).json({ error: "pestDetected field is required" });
    }

    // ✅ Strongly structured and safe prompt (plain text only)
    const prompt = `
You are an agricultural expert specializing in sugarcane crop health.

The AI model has detected a sugarcane leaf condition called '${pestDetected}'.

Write a clear, numbered explanation for farmers (6–10 short points).  

Rules:
- Use plain text only. No Markdown, no *, no #, no symbols.
- Each point starts with its number (1., 2., 3., etc.) on a new line.
- Keep language simple, direct, and practical for rural farmers.
- Write only in ${language || "English"}.
- Do not mix multiple languages.
- Avoid technical jargon; use everyday terms.
- Keep each point concise (1–2 sentences).
- After every point, add a line break.
Include:
1. Simple description of the disease  
2. Causes  
3. Visible symptoms on leaf and plant  
4. Low-cost treatments  
5. Preventive measures  
6. Helpful farmer tips
`;

    // ✅ Call your OpenAI proxy (expects "message" not "contents")
    const response = await fetch(OPENAI_PROXY, {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ message: prompt }),
    });

    const data = await response.json();

    // ✅ Extract text safely
    let aiText =
      data.reply ||
      data.response ||
      data.output ||
      data.text ||
      data.choices?.[0]?.message?.content ||
      data.choices?.[0]?.text ||
      "No valid AI response received.";

    // ✅ Clean Markdown, bullets, and extra spaces
    aiText = aiText
      .replace(/\*/g, "")
      .replace(/[#_`~>-]/g, "")
      .replace(/\r/g, "")
      .replace(/\s*\n\s*/g, "\n")
      .replace(/(\d+)\.\s*/g, "\n$1. ")
      .trim();

    res.json({ advice: aiText });
  } catch (err) {
    console.error("❌ /advice error:", err);
    res.status(500).json({ error: err.message });
  }
});

module.exports = router;
