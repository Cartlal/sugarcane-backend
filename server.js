const express = require("express");
const cors = require("cors");
const mongoose = require("mongoose");
const dotenv = require("dotenv");

// Load environment variables
dotenv.config();

const app = express();

// =========================
// MIDDLEWARE
// =========================
app.use(
  cors({
    origin: "*",
    methods: ["GET", "POST", "PUT", "DELETE", "OPTIONS"],
    allowedHeaders: ["Content-Type"],
  })
);

app.use(express.json());

// =========================
// ROUTE IMPORTS
// =========================
const farmerRoutes = require("./routes/farmerRoutes");
const adviceRoutes = require("./routes/adviceRoutes");
const analyzeRoutes = require("./routes/analyzeRoutes");
const adminRoutes = require("./routes/adminRoutes");
const authRoutes = require("./routes/authRoutes");
const ttsRoutes = require("./routes/ttsRoutes"); // ⭐ NEW TTS ROUTE

// =========================
// DATABASE CONNECTION
// =========================
mongoose
  .connect(process.env.MONGODB_URI)
  .then(() => console.log("✅ MongoDB Connected"))
  .catch((err) => console.error("❌ MongoDB Error:", err));

// =========================
// REGISTER API ROUTES
// =========================
app.use("/api/auth", authRoutes);          // Signup/Login
app.use("/api", farmerRoutes);             // Farmer Registration + Profile
app.use("/api", adviceRoutes);             // AI Text Advice
app.use("/api", analyzeRoutes);            // Teachable Machine API
app.use("/api", adminRoutes);              // Admin Panel Routes
app.use("/api", ttsRoutes);                // ⭐ GOOGLE TTS AUDIO PROXY

// =========================
// ROOT HEALTH CHECK
// =========================
app.get("/", (req, res) => {
  res.send(`
    <h2>🌿 Sugarcane Backend Online</h2>
    <p>All systems running successfully.</p>

    <h3>Available Endpoints:</h3>
    <ul>
      <li><b>POST</b> /api/auth/signup – User Signup</li>
      <li><b>POST</b> /api/auth/login – User Login</li>

      <li><b>POST</b> /api/register-profile – Create Farmer Profile</li>
      <li><b>POST</b> /api/update-profile – Update Farmer Profile</li>

      <li><b>POST</b> /api/advice – Get AI Farming Advice</li>
      <li><b>POST</b> /api/analyze – Teachable Machine Disease Detection</li>

      <li><b>POST</b> /api/tts – Text-to-Speech Audio</li>

      <li><b>GET</b> /api/admin/farmers – Admin: List All Farmers</li>
      <li><b>DELETE</b> /api/admin/delete/:id – Admin: Delete Farmer</li>
    </ul>
  `);
});

// =========================
// START SERVER
// =========================
const PORT = process.env.PORT || 10000;
app.listen(PORT, () =>
  console.log(`🚀 Backend running on port ${PORT}`)
);
