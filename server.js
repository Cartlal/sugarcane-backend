const express = require("express");
const cors = require("cors");
const mongoose = require("mongoose");
const dotenv = require("dotenv");
dotenv.config();

const farmerRoutes = require("./routes/farmerRoutes");
const adviceRoutes = require("./routes/adviceRoutes");
const analyzeRoutes = require("./routes/analyzeRoutes");

const app = express();

// ✅ Enable CORS for Netlify and any origin
app.use(
  cors({
    origin: "*", // allow all origins (Netlify, local, etc.)
    methods: ["GET", "POST", "OPTIONS"],
    allowedHeaders: ["Content-Type"],
  })
);

// ✅ Middleware
app.use(express.json());

// ✅ MongoDB Connection
mongoose
  .connect(process.env.MONGODB_URI)
  .then(() => console.log("✅ MongoDB connected"))
  .catch((err) => console.error("❌ MongoDB connection error:", err));

// ✅ API Routes
app.use("/api", farmerRoutes);
app.use("/api", adviceRoutes);
app.use("/api", analyzeRoutes);

// ✅ Health check route
app.get("/", (req, res) => {
  res.send("✅ Sugarcane backend running successfully");
});

// ✅ Start server
const PORT = process.env.PORT || 10000;
app.listen(PORT, () => console.log(`✅ Server live on port ${PORT}`));
