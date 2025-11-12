const express = require("express");
const fetch = (...args) =>
  import("node-fetch").then(({ default: fetch }) => fetch(...args));

const router = express.Router();

// ✅ Your Teachable Machine Model URL
const MODEL_URL = "https://teachablemachine.withgoogle.com/models/BiAmQT65g/";

router.post("/analyze", async (req, res) => {
  try {
    const { imageUrl } = req.body;
    if (!imageUrl) {
      return res.status(400).json({ error: "Image URL is required" });
    }

    // ⚠️ Teachable Machine’s hosted models don’t have a direct HTTP API.
    // They must be used client-side (in browser) with TensorFlow.js.
    // However, if you want to call it from backend, you must download model.json,
    // weights.bin, and use tfjs-node (heavy). This code gives a simple response structure.

    // For now, we’ll mock prediction using frontend analysis result.
    // In production, analyze via frontend and send detected label here.

    // Example simulated response (backend placeholder)
    res.json({
      pestDetected: "Prediction handled in frontend",
      modelUsed: MODEL_URL,
      imageUrl,
    });
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

module.exports = router;
