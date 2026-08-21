const express = require("express");
const cors = require("cors");
const mongoose = require("mongoose");
const authRoutes = require("./routes/auth.routes");
const technicianRoutes = require("./routes/technician.routes");
const diagnosisRoutes = require("./routes/diagnosis.routes");
const repairRoutes = require("./routes/repair.routes");
const app = express();

const allowedOrigin = process.env.CLIENT_URL || "http://localhost:5173";

app.use(cors({ origin: allowedOrigin }));
app.use(express.json());
app.use("/api/auth", authRoutes);
app.use("/api", technicianRoutes);
app.use("/api", diagnosisRoutes);
app.use("/api", repairRoutes);

app.get("/api/health", (req, res) => {
  const databaseConnected = mongoose.connection.readyState === 1;
  res.status(databaseConnected ? 200 : 503).json({
    success: true,
    message: databaseConnected
      ? "LocalRepair API is running"
      : "LocalRepair API is running without a database connection",
    data: {
      service: "backend",
      status: databaseConnected ? "ok" : "degraded",
      database: databaseConnected ? "connected" : "disconnected",
      timestamp: new Date().toISOString(),
    },
  });
});

app.get("/", (req, res) => {
  res.json({ success: true, message: "LocalRepair API", data: null });
});

app.use((req, res) => {
  res.status(404).json({
    success: false,
    message: "Route not found",
    errors: [],
  });
});

app.use((error, _req, res, _next) => {
  console.error("Request failed:", error.message);
  res
    .status(error.statusCode || 500)
    .json({
      success: false,
      message: error.statusCode
        ? error.message
        : "An unexpected server error occurred",
      errors: error.details || [],
    });
});

module.exports = app;
