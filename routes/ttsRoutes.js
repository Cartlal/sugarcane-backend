const express = require("express");
const router = express.Router();
const axios = require("axios");

router.post("/tts", async (req, res) => {
  try {
    const { text, lang } = req.body;

    if (!text) {
      return res.status(400).json({ error: "Text is required" });
    }

    // Map your app languages → correct Indian voice models
    const modelMap = {
      English: "ai4bharat/indic-tts-en",
      Hindi: "ai4bharat/indic-tts-hi",
      Kannada: "ai4bharat/indic-tts-kn",
      Marathi: "ai4bharat/indic-tts-mr",
    };

    const model = modelMap[lang] || modelMap["English"];

    const response = await axios({
      url: `https://api-inference.huggingface.co/models/${model}`,
      method: "POST",
      headers: {
        Authorization: `Bearer ${process.env.HF_KEY}`,
        "Content-Type": "application/json",
      },
      data: { text },
      responseType: "arraybuffer",
    });

    res.setHeader("Content-Type", "audio/wav");
    res.send(response.data);

  } catch (err) {
    console.error("TTS ERROR:", err.message);
    res.status(500).json({ error: "TTS generation failed" });
  }
});

module.exports = router;
