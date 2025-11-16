const mongoose = require("mongoose");

const userSchema = new mongoose.Schema({

  email: {
    type: String,
    required: [true, "Email is required"],
    unique: true,
    lowercase: true,
    trim: true
  },

  phone: {
    type: String,
    required: [true, "Phone number is required"],
    trim: true,
    minlength: 8,
    maxlength: 15
  },

  password: {
    type: String,
    required: [true, "Password is required"]
  }

}, { timestamps: true });

module.exports = mongoose.model("User", userSchema);
