const mongoose = require("mongoose");

const resultSchema = new mongoose.Schema({
  farmerId: { type: mongoose.Schema.Types.ObjectId, ref: "Farmer" },
  imageUrl: String,
  pestDetected: String,
  advice: String,
  date: { type: Date, default: Date.now }
});

module.exports = mongoose.model("Result", resultSchema);
