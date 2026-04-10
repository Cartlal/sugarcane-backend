const express = require("express");
const router = express.Router();
const axios = require("axios");

router.post("/tts", async (req, res) => {
  try {
    const { text, lang } = req.body;

    if (!text)
      return res.status(400).json({ error: "Text is required" });

    const langMap = {
      English: "en",
      Hindi: "hi",
      Kannada: "kn",
      Marathi: "mr",
    };

    const code = langMap[lang] || "en";

    const ttsUrl =
      `https://translate.google.com/translate_tts?ie=UTF-8&client=tw-ob&tl=${code}&q=${encodeURIComponent(text)}`;

    const response = await axios({
      method: "GET",
      url: ttsUrl,
      responseType: "arraybuffer",
      headers: {
        "User-Agent":
          "Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/120.0.0.0 Safari/537.36",
      },
    });

    res.set({
      "Content-Type": "audio/mpeg",
      "Content-Length": response.data.length,
    });

    res.send(response.data);

  } catch (err) {
    console.error("TTS ERROR:", err.message);
    return res.status(500).json({ error: "TTS failed" });
  }
});

module.exports = router;
