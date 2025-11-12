const express = require("express");
const cors = require("cors");
const mongoose = require("mongoose");
const dotenv = require("dotenv");
dotenv.config();

const farmerRoutes = require("./routes/farmerRoutes");
const adviceRoutes = require("./routes/adviceRoutes");
const analyzeRoutes = require("./routes/analyzeRoutes");

const app = express();
app.use(cors());
app.use(express.json());

// MongoDB Connection
mongoose.connect(process.env.MONGODB_URI)
  .then(() => console.log("✅ MongoDB connected"))
  .catch(err => console.error("❌ MongoDB connection error:", err));

// Routes
app.use("/api", farmerRoutes);
app.use("/api", adviceRoutes);
app.use("/api", analyzeRoutes);

app.get("/", (req, res) => res.send("✅ Sugarcane backend running"));

const PORT = process.env.PORT || 3000;
app.listen(PORT, () => console.log(`✅ Server running on port ${PORT}`));
