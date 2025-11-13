const express = require("express");
const bcrypt = require("bcryptjs");
const Farmer = require("../models/Farmer");
const router = express.Router();

// ======================= SIGNUP =======================
router.post("/signup", async (req, res) => {
  try {
    const farmerData = req.body;

    // Check phone number already exists
    const exists = await Farmer.findOne({ phone: farmerData.phone });
    if (exists) {
      return res.status(400).json({ error: "Phone number already registered" });
    }

    // Check password exists
    if (!farmerData.password || farmerData.password.length < 4) {
      return res.status(400).json({ error: "Password must be at least 4 characters" });
    }

    // Encrypt password
    farmerData.password = await bcrypt.hash(farmerData.password, 10);

    // Save farmer
    const farmer = await Farmer.create(farmerData);

    res.json({
      message: "Signup successful",
      farmer: {
        id: farmer._id,
        name: farmer.name,
        surname: farmer.surname,
        village: farmer.village,
        yearsFarming: farmer.yearsFarming,
        mainCrop: farmer.mainCrop,
      },
    });
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

// ======================= LOGIN =======================
router.post("/login", async (req, res) => {
  try {
    const { phone, password } = req.body;

    // Check farmer exists
    const farmer = await Farmer.findOne({ phone });
    if (!farmer) return res.status(404).json({ error: "Farmer not found" });

    // Compare password
    const valid = await bcrypt.compare(password, farmer.password);
    if (!valid) return res.status(401).json({ error: "Incorrect password" });

    res.json({
      message: "Login successful",
      farmer: {
        id: farmer._id,
        name: farmer.name,
        surname: farmer.surname,
        village: farmer.village,
        yearsFarming: farmer.yearsFarming,
        mainCrop: farmer.mainCrop,
      },
    });
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

module.exports = router;
