const mongoose = require("mongoose");

const farmerSchema = new mongoose.Schema({

  // PROFILE DATA ONLY (No login fields here)
  email: { type: String, required: true },  // this connects profile to user

  name: { type: String, trim: true },
  middleName: { type: String, trim: true },
  surname: { type: String, trim: true },

  address: { type: String, trim: true },
  pincode: { type: String, trim: true },
  village: { type: String, trim: true },
  district: { type: String, trim: true },
  state: { type: String, trim: true },

  plotSize: { type: String, trim: true },
  yearsFarming: { type: Number, default: 0 },

  mainCrop: { type: String, trim: true },
  secondaryCrop: { type: String, trim: true },

  soilType: { type: String, trim: true },
  irrigationType: { type: String, trim: true },

}, { timestamps: true });

module.exports = mongoose.model("Farmer", farmerSchema);
