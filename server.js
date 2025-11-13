const express = require("express");
const cors = require("cors");
const mongoose = require("mongoose");
const dotenv = require("dotenv");

// Load .env
dotenv.config();

const app = express();

// ===== MIDDLEWARE =====
app.use(
  cors({
    origin: "*", // allow Netlify + all browsers
    methods: ["GET", "POST", "PUT", "DELETE", "OPTIONS"],
    allowedHeaders: ["Content-Type"],
  })
);

app.use(express.json());

// ===== ROUTE IMPORTS =====
const farmerRoutes = require("./routes/farmerRoutes");
const adviceRoutes = require("./routes/adviceRoutes");
const analyzeRoutes = require("./routes/analyzeRoutes");
const adminRoutes = require("./routes/adminRoutes");
const authRoutes = require("./routes/authRoutes");

// ===== DATABASE CONNECTION =====
mongoose
  .connect(process.env.MONGODB_URI)
  .then(() => console.log("✅ MongoDB connected"))
  .catch((err) => console.error("❌ MongoDB connection error:", err));

// ===== REGISTER API ROUTES =====
app.use("/api/auth", authRoutes);     // Login / Signup
app.use("/api", farmerRoutes);        // Farmer CRUD
app.use("/api", adviceRoutes);        // AI Advice
app.use("/api", analyzeRoutes);       // Model testing
app.use("/api", adminRoutes);         // Admin operations

// ===== ROOT HEALTH CHECK =====
app.get("/", (req, res) => {
  res.send(`
    <h2>🌿 Sugarcane Backend Online</h2>
    <p>All systems running.</p>
    <h3>Available Endpoints:</h3>
    <ul>
      <li><b>POST</b> /api/auth/signup – Farmer Signup</li>
      <li><b>POST</b> /api/auth/login – Farmer Login</li>
      <li><b>POST</b> /api/register – Full Registration</li>
      <li><b>GET</b> /api/farmers – List all farmers</li>
      <li><b>DELETE</b> /api/delete/:id – Remove a farmer (Admin)</li>
      <li><b>POST</b> /api/advice – Get AI Advice</li>
      <li><b>POST</b> /api/analyze – Teachable Machine test</li>
    </ul>
  `);
});

// ===== START SERVER =====
const PORT = process.env.PORT || 10000;
app.listen(PORT, () =>
  console.log(`🚀 Backend running on port ${PORT}`)
);
