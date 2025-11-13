const mongoose = require("mongoose");

const farmerSchema = new mongoose.Schema({
  name: String,
  middleName: String,
  surname: String,
  phone: { type: String, unique: true },
  address: String,
  pincode: String,
  village: String,
  district: String,
  state: String,
  plotSize: String,
  yearsFarming: String,
  mainCrop: String,
  secondaryCrop: String,
  soilType: String,
  irrigationType: String,
  password: { type: String, required: true }
});
