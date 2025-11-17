const express = require("express");
const router = express.Router();
const axios = require("axios"); // Use axios for better stability

router.post("/tts", async (req, res) => {
  try {
    const { text, lang } = req.body;

    if (!text) return res.status(400).json({ error: "Text is required" });

    const langMap = {
      English: "en",
      Hindi: "hi",
      Kannada: "kn",
      Marathi: "mr",
    };

    const code = langMap[lang] || "en";

    // Google TTS Endpoint
    const ttsUrl = `https://translate.google.com/translate_tts?ie=UTF-8&client=tw-ob&tl=${code}&q=${encodeURIComponent(text)}`;

    // Request audio as a stream (arraybuffer)
    const response = await axios({
      method: "get",
      url: ttsUrl,
      responseType: "arraybuffer", // Crucial: Get raw binary data
      headers: {
        "User-Agent": "Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/120.0.0.0 Safari/537.36",
      },
    });

    // Send audio back to frontend
    res.set({
      "Content-Type": "audio/mpeg",
      "Content-Length": response.data.length,
    });

    res.send(response.data);

  } catch (err) {
    console.error("TTS Error:", err.message);
    res.status(500).json({ error: "Failed to generate audio" });
  }
});

module.exports = router;
