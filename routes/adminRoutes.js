const express = require("express");
const Farmer = require("../models/Farmer"); // your existing model
const router = express.Router();

// Get all farmers
router.get("/farmers", async (req, res) => {
  try {
    const farmers = await Farmer.find();
    res.json(farmers);
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

// Delete farmer by ID
router.delete("/farmers/:id", async (req, res) => {
  try {
    const farmer = await Farmer.findByIdAndDelete(req.params.id);
    if (!farmer) return res.status(404).json({ error: "Farmer not found" });
    res.json({ message: "Farmer deleted successfully" });
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

module.exports = router;
