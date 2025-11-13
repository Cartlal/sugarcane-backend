const express = require("express");
const router = express.Router();
const Farmer = require("../models/Farmer");

// ============================
// CREATE NEW FARMER PROFILE
// ============================
router.post("/register", async (req, res) => {
  try {
    const farmer = await Farmer.create(req.body);

    res.status(201).json({
      message: "Farmer registered successfully",
      farmer,
    });

  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

// ============================
// UPDATE-PROFILE (Same as register)
// but allows updating by _id
// ============================
router.post("/update-profile", async (req, res) => {
  try {
    const { id, ...updateData } = req.body;

    // If no ID provided → create new farmer
    if (!id) {
      const farmer = await Farmer.create(updateData);
      return res.json({
        message: "Profile saved successfully",
        farmer,
      });
    }

    // If ID provided → update farmer
    const farmer = await Farmer.findByIdAndUpdate(id, updateData, { new: true });

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
