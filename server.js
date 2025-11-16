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
    origin: "*",
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
app.use("/api/auth", authRoutes);     
app.use("/api", farmerRoutes);        
app.use("/api", adviceRoutes);        
app.use("/api", analyzeRoutes);       
app.use("/api", adminRoutes);         

// ===== ROOT HEALTH CHECK =====
app.get("/", (req, res) => {
  res.send(`
    <h2>🌿 Sugarcane Backend Online</h2>
    <p>All systems running.</p>
    <h3>Available Endpoints:</h3>
    <ul>
      <li><b>POST</b> /api/auth/signup – User Signup</li>
      <li><b>POST</b> /api/auth/login – User Login</li>
      <li><b>POST</b> /api/register-profile – Create Farmer Profile</li>
      <li><b>POST</b> /api/update-profile – Update Farmer Profile</li>
      <li><b>POST</b> /api/advice – Get AI Advice</li>
      <li><b>POST</b> /api/analyze – Teachable Machine Analysis</li>
      <li><b>GET</b> /api/admin/farmers – Admin: List Farmers</li>
      <li><b>DELETE</b> /api/admin/delete/:id – Admin: Delete Farmer</li>
    </ul>
  `);
});

// ===== START SERVER =====
const PORT = process.env.PORT || 10000;
app.listen(PORT, () =>
  console.log(`🚀 Backend running on port ${PORT}`)
);
