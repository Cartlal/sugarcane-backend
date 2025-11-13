const express = require("express");
const bcrypt = require("bcryptjs");
const Farmer = require("../models/Farmer");

const router = express.Router();

// ============================================================
//                        SIGNUP
// ============================================================
router.post("/signup", async (req, res) => {
  try {
    const { email, phone, password } = req.body;

    // Validate required fields
    if (!email || !phone || !password) {
      return res.status(400).json({ error: "Email, phone, and password are required" });
    }

    // Basic email validation
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    if (!emailRegex.test(email)) {
      return res.status(400).json({ error: "Invalid email format" });
    }

    // Basic phone number validation
    if (phone.length < 8 || phone.length > 15) {
      return res.status(400).json({ error: "Phone number must be between 8–15 digits" });
    }

    // Password length check
    if (password.length < 6) {
      return res.status(400).json({ error: "Password must be at least 6 characters long" });
    }

    // Check if email or phone already exist
    const exists = await Farmer.findOne({ $or: [{ email }, { phone }] });

    if (exists) {
      return res.status(400).json({ error: "Email or phone is already registered" });
    }

    // Hash password
    const hashedPassword = await bcrypt.hash(password, 10);

    // Create farmer login account (farmer full profile is separate)
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
        phone: farmer.phone,
      }
    });

  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

// ============================================================
//                        LOGIN
// ============================================================
router.post("/login", async (req, res) => {
  try {
    const { email, password } = req.body;

    if (!email || !password) {
      return res.status(400).json({ error: "Email and password are required" });
    }

    // Check if email exists
    const farmer = await Farmer.findOne({ email });

    if (!farmer) {
      return res.status(404).json({ error: "Email not registered" });
    }

    // Compare password
    const validPassword = await bcrypt.compare(password, farmer.password);

    if (!validPassword) {
      return res.status(401).json({ error: "Incorrect password" });
    }

    res.json({
      message: "Login successful",
      farmer: {
        id: farmer._id,
        email: farmer.email,
        phone: farmer.phone,
      }
    });

  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

module.exports = router;
