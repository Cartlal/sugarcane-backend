const express = require("express");
const router = express.Router();
const Farmer = require("../models/Farmer");


// =====================================================
// 1️⃣ CREATE FARMER PROFILE (after login/signup)
// =====================================================
router.post("/register-profile", async (req, res) => {
  try {
    const { email, ...profileData } = req.body;

    if (!email) {
      return res.status(400).json({ error: "Email is required" });
    }

    // update only profile fields (not password or phone)
    const farmer = await Farmer.findOneAndUpdate(
      { email },
      { $set: profileData },
      { new: true }
    );

    if (!farmer) {
      return res.status(404).json({ error: "Farmer not found" });
    }

    res.json({
      message: "Profile saved successfully",
      farmer,
    });

  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});


// =====================================================
// 2️⃣ UPDATE PROFILE (edit profile later)
// =====================================================
router.post("/update-profile", async (req, res) => {
  try {
    const { email, ...updateData } = req.body;

    if (!email) {
      return res.status(400).json({ error: "Email is required" });
    }

    const farmer = await Farmer.findOneAndUpdate(
      { email },
      updateData,
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
