const express = require("express");
const router = express.Router();
const Farmer = require("../models/Farmer");

// Register a farmer
router.post("/register", async (req, res) => {
  try {
    const farmer = new Farmer(req.body);
    await farmer.save();
    res.status(201).json({ message: "Farmer registered", farmer });
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});
// ============================
// UPDATE FARMER PROFILE
// ============================
router.post("/update-profile", async (req, res) => {
  try {
    const { email, ...profileData } = req.body;

    if (!email) {
      return res.status(400).json({ error: "Email is required" });
    }

    const farmer = await Farmer.findOneAndUpdate(
      { email },
      profileData,
      { new: true }
    );

    if (!farmer) {
      return res.status(404).json({ error: "Farmer not found" });
    }

    res.json({
      message: "Profile updated successfully",
      farmer
    });

  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

module.exports = router;
