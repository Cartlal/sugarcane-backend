const mongoose = require("mongoose");

const farmerSchema = new mongoose.Schema({
  // LOGIN FIELDS
  email: { type: String, required: true, unique: true },
  phone: { type: String, required: true },

  password: { type: String, required: true },

  // FARMER REGISTRATION FIELDS
  name: String,
  middleName: String,
  surname: String,
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
});

module.exports = mongoose.model("Farmer", farmerSchema);
