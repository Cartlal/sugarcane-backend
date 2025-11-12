const express = require("express");
const cors = require("cors");
const mongoose = require("mongoose");
const dotenv = require("dotenv");

// Load environment variables
dotenv.config();

const app = express();

// ===== ROUTE IMPORTS =====
const farmerRoutes = require("./routes/farmerRoutes");
const adviceRoutes = require("./routes/adviceRoutes");
const analyzeRoutes = require("./routes/analyzeRoutes");
const adminRoutes = require("./routes/adminRoutes"); // ✅ new admin route

// ===== MIDDLEWARE =====
app.use(
  cors({
    origin: "*", // Allow Netlify, local dev, and external requests
    methods: ["GET", "POST", "DELETE", "OPTIONS"],
    allowedHeaders: ["Content-Type"],
  })
);

app.use(express.json());

// ===== DATABASE CONNECTION =====
mongoose
  .connect(process.env.MONGODB_URI, {
    useNewUrlParser: true,
    useUnifiedTopology: true,
  })
  .then(() => console.log("✅ MongoDB connected"))
  .catch((err) => console.error("❌ MongoDB connection error:", err));

// ===== ROUTES =====
app.use("/api", farmerRoutes);
app.use("/api", adviceRoutes);
app.use("/api", analyzeRoutes);
app.use("/api", adminRoutes); // ✅ added admin routes

// ===== ROOT CHECK =====
app.get("/", (req, res) => {
  res.send(`
    <h2>✅ Sugarcane Backend Active</h2>
    <p>Connected to MongoDB and running successfully.</p>
    <ul>
      <li>GET <code>/api/farmers</code> → List all farmers</li>
      <li>POST <code>/api/register</code> → Register new farmer</li>
      <li>POST <code>/api/advice</code> → Get AI advice</li>
      <li>GET <code>/api/analyze</code> → Model test</li>
    </ul>
  `);
});

// ===== SERVER START =====
const PORT = process.env.PORT || 10000;
app.listen(PORT, () => console.log(`✅ Server running on port ${PORT}`));
