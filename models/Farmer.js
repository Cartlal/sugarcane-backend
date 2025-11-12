const mongoose = require("mongoose");

const farmerSchema = new mongoose.Schema({
  name: String,
  middleName: String,
  surname: String,
  phone: String,
  address: String,
  pincode: String,
  village: String,
  district: String,
  state: String,
  plotSize: String,
  yearsFarming: Number,
  mainCrop: String,
  secondaryCrop: String,
  soilType: String,
  irrigationType: String,
  createdAt: { type: Date, default: Date.now }
});

module.exports = mongoose.model("Farmer", farmerSchema);
