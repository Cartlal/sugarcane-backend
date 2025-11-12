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

module.exports = router;
