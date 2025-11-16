const User = require("../models/User");
const bcrypt = require("bcryptjs");

// ------------------- SIGNUP -------------------
exports.signup = async (req, res) => {
  try {
    const { email, phone, password } = req.body;

    if (!email || !phone || !password) {
      return res.status(400).json({ error: "Email, phone, and password are required" });
    }

    const exists = await User.findOne({ email });
    if (exists) {
      return res.status(400).json({ error: "Email already registered" });
    }

    const hashedPassword = await bcrypt.hash(password, 10);

    const user = await User.create({
      email,
      phone,
      password: hashedPassword
    });

    return res.json({
      message: "Signup successful",
      user: {
        id: user._id,
        email: user.email,
        phone: user.phone
      }
    });

  } catch (err) {
    return res.status(500).json({ error: err.message });
  }
};

// ------------------- LOGIN -------------------
exports.login = async (req, res) => {
  try {
    const { email, password } = req.body;

    if (!email || !password) {
      return res.status(400).json({ error: "Email and password are required" });
    }

    const user = await User.findOne({ email });
    if (!user) {
      return res.status(404).json({ error: "User not found" });
    }

    const valid = await bcrypt.compare(password, user.password);
    if (!valid) {
      return res.status(401).json({ error: "Incorrect password" });
    }

    return res.json({
      message: "Login successful",
      user: {
        id: user._id,
        email: user.email,
        phone: user.phone
      }
    });

  } catch (err) {
    return res.status(500).json({ error: err.message });
  }
};
