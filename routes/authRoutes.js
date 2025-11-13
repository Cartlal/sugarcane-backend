const express = require("express");
const bcrypt = require("bcryptjs");
const Farmer = require("../models/Farmer");
const router = express.Router();


// ================== SIGNUP ==================
router.post("/signup", async (req, res) => {
  try {
    const { email, phone, password } = req.body;

    if (!email || !phone || !password) {
      return res.status(400).json({ error: "All fields are required" });
    }

    // Check if email or phone already registered
    const exists = await Farmer.findOne({ $or: [{ email }, { phone }] });
    if (exists) {
      return res.status(400).json({ error: "Email or phone already registered" });
    }

    // Hash password
    const hashedPassword = await bcrypt.hash(password, 10);

    const farmer = await Farmer.create({
      email,
      phone,
      password: hashedPassword
    });

    res.json({
      message: "Signup successful",
      farmer: {
        id: farmer._id,
        email: farmer.email,
        phone: farmer.phone
      }
    });

  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});


// ================== LOGIN ==================
router.post("/login", async (req, res) => {
  try {
    const { email, password } = req.body;

    const farmer = await Farmer.findOne({ email });
    if (!farmer) {
      return res.status(404).json({ error: "Email not registered" });
    }

    const valid = await bcrypt.compare(password, farmer.password);
    if (!valid) {
      return res.status(401).json({ error: "Incorrect password" });
    }

    res.json({
      message: "Login successful",
      farmer: {
        id: farmer._id,
        email: farmer.email,
        phone: farmer.phone
      }
    });

  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});


module.exports = router;
