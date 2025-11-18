const express = require("express");
const router = express.Router();
const axios = require("axios");

router.post("/tts", async (req, res) => {
  try {
    const { text, lang } = req.body;

    if (!text) {
      return res.status(400).json({ error: "Text is required" });
    }

    // MAPPING to ACTIVE WORKING MODELS
    const models = {
      English: "coqui/XTTS-v2",
      Kannada: "facebook/mms-tts-kan",
      Hindi: "facebook/mms-tts-hin",
      Marathi: "facebook/mms-tts-mar",
    };

    const selectedModel = models[lang] || models["English"];

    const HF_API = process.env.HF_KEY;

    const response = await axios({
      url: `https://api-inference.huggingface.co/models/${selectedModel}`,
      method: "POST",
      responseType: "arraybuffer",
      headers: {
        "Authorization": `Bearer ${HF_API}`,
        "Content-Type": "application/json",
      },
      data: { inputs: text },
    });

    res.set({
      "Content-Type": "audio/mpeg",
      "Content-Length": response.data.length,
    });

    res.send(response.data);

  } catch (err) {
    console.error("TTS ERROR:", err.response?.status, err.message);
    res.status(500).json({ error: "TTS failed" });
  }
});

module.exports = router;
