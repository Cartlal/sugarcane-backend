const express = require("express");
const router = express.Router();
const Farmer = require("../models/Farmer");

// =====================================================
// 1️⃣ CREATE or UPDATE FARMER PROFILE (smart auto-upsert)
// =====================================================
router.post("/register-profile", async (req, res) => {
  try {
    const { email, ...profileData } = req.body;

    if (!email) {
      return res.status(400).json({ error: "Email is required" });
    }

    // Create new farmer profile OR update existing one
    const farmer = await Farmer.findOneAndUpdate(
      { email },
      { $set: profileData },
      { new: true, upsert: true }   // <--- IMPORTANT
    );

    res.json({
      message: "Profile saved successfully",
      farmer,
    });

  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});


// =====================================================
// 2️⃣ UPDATE EXISTING PROFILE (farmer must exist)
// =====================================================
router.post("/update-profile", async (req, res) => {
  try {
    const { email, ...updateData } = req.body;

    if (!email) {
      return res.status(400).json({ error: "Email is required" });
    }

    const farmer = await Farmer.findOneAndUpdate(
      { email },
      { $set: updateData },
      { new: true }
    );

    if (!farmer) {
      return res.status(404).json({ error: "Farmer not found" });
    }

    res.json({
      message: "Profile updated successfully",
      farmer,
    });

  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

module.exports = router;
