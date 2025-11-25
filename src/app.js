// src/app.js
const express = require("express");
const app = express();

app.use(express.json());

// Routes
const authRoutes = require("./routes/auth");
const taskRoutes = require("./routes/tasks");

app.use("/api/auth", authRoutes);
app.use("/api/tasks", taskRoutes);

// Basic health check
app.get("/health", (req, res) => {
  res.json({ status: "ok" });
});

// Global error handler (simple version)
app.use((err, req, res, next) => {
  console.error(err);
  const status = err.statusCode || 500;
  res.status(status).json({ message: err.message || "Internal server error" });
});

module.exports = app;
