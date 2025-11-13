const mongoose = require("mongoose");

const farmerSchema = new mongoose.Schema({
  name: String,
  middleName: String,
  surname: String,
  phone: { type: String, required: true, unique: true },
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
  
  // Required for login
  password: { type: String, required: true },
});

module.exports = mongoose.model("Farmer", farmerSchema);
