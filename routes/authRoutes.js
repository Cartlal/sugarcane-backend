const express = require("express");
const bcrypt = require("bcryptjs");
const User = require("../models/User");

const router = express.Router();

// ============================================================
//                        SIGNUP
// ============================================================
router.post("/signup", async (req, res) => {
  try {
    const { email, phone, password } = req.body;

    if (!email || !phone || !password) {
      return res.status(400).json({ error: "Email, phone, and password are required" });
    }

    // Email validation
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    if (!emailRegex.test(email)) {
      return res.status(400).json({ error: "Invalid email format" });
    }

    // Phone validation
    if (phone.length < 8 || phone.length > 15) {
      return res.status(400).json({ error: "Phone number must be between 8–15 digits" });
    }

    // Password validation
    if (password.length < 6) {
      return res.status(400).json({ error: "Password must be at least 6 characters long" });
    }

    // Check if email already exists
    const exists = await User.findOne({ email });
    if (exists) {
      return res.status(400).json({ error: "Email is already registered" });
    }

    // Hash password
    const hashedPassword = await bcrypt.hash(password, 10);

    // Create User (auth account only)
    const user = await User.create({
      email,
      phone,
      password: hashedPassword
    });

    res.json({
      message: "Signup successful",
      user: {
        id: user._id,
        email: user.email,
        phone: user.phone
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
    const user = await User.findOne({ email });

    if (!user) {
      return res.status(404).json({ error: "Email not registered" });
    }

    // Compare hashed password
    const valid = await bcrypt.compare(password, user.password);
    if (!valid) {
      return res.status(401).json({ error: "Incorrect password" });
    }

    res.json({
      message: "Login successful",
      user: {
        id: user._id,
        email: user.email,
        phone: user.phone
      }
    });

  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

module.exports = router;
