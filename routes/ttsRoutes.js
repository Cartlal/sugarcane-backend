const express = require("express");
const router = express.Router();
const fetch = (...args) =>
  import("node-fetch").then(({ default: fetch }) => fetch(...args));

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

    const ttsUrl =
      `https://translate.google.com/translate_tts?ie=UTF-8&client=tw-ob&tl=${code}&q=${encodeURIComponent(text)}`;

    const googleRes = await fetch(ttsUrl, {
      headers: {
        "User-Agent":
          "Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 Chrome/120 Safari/537.36",
      },
    });

    const audioBuffer = await googleRes.arrayBuffer();

    res.set({
      "Content-Type": "audio/mpeg",
      "Content-Length": audioBuffer.byteLength,
    });

    res.send(Buffer.from(audioBuffer));
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

module.exports = router;
