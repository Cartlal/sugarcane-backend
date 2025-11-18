const express = require("express");
const router = express.Router();
const textToSpeech = require("@google-cloud/text-to-speech");
const client = new textToSpeech.TextToSpeechClient();

router.post("/tts", async (req, res) => {
  try {
    const { text, lang } = req.body;

    if (!text) {
      return res.status(400).json({ error: "Text is required" });
    }

    // Map frontend language → correct Indian TTS voice
    const voiceMap = {
      English: "en-IN",
      Hindi: "hi-IN",
      Kannada: "kn-IN",
      Marathi: "mr-IN",
    };

    const languageCode = voiceMap[lang] || "en-IN";

    const request = {
      input: { text },
      voice: {
        languageCode,
        ssmlGender: "FEMALE",
      },
      audioConfig: {
        audioEncoding: "MP3",
      },
    };

    const [response] = await client.synthesizeSpeech(request);

    res.set({
      "Content-Type": "audio/mpeg",
      "Content-Length": response.audioContent.length,
    });

    res.send(response.audioContent);

  } catch (err) {
    console.error("TTS Error:", err);
    res.status(500).json({ error: "Failed to generate audio" });
  }
});

module.exports = router;
