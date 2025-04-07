/**
 * File: server.js
 * Student's Name: Manoj Bishwakarma, Laxman Rokaya
 * StudentID: 200544391, 200544400
 * Date: April 6, 2024
 */

// Load environment variables
require("dotenv").config();

// Core dependencies
const express = require("express");
const mongoose = require("mongoose");
const cors = require("cors");
const morgan = require("morgan"); // For logging HTTP requests

// Initialize Express app
const app = express();
const PORT = process.env.PORT || 5000;

// Import route modules
const recipeRoutes = require("./routes/recipeRoutes");
const authRoutes = require("./routes/authRoutes");

// ===== MIDDLEWARE SETUP =====
// CORS configuration
const corsOptions = {
  origin: [
    "http://localhost:8081",
    "http://localhost:3000",
    "http://localhost:5000",
  ],
  credentials: true,
  methods: ["GET", "POST", "PUT", "DELETE"],
  allowedHeaders: ["Content-Type", "Authorization"],
};

// Apply middleware
app.use(cors(corsOptions));
app.use(express.json());
app.use(express.urlencoded({ extended: true }));

// Request logging in development mode
if (process.env.NODE_ENV !== "production") {
  app.use(morgan("dev"));
}

// ===== DATABASE CONNECTION =====
const connectToDatabase = async () => {
  console.log("Attempting to connect to MongoDB...");

  try {
    await mongoose.connect(process.env.MONGODB_URI, {
      useNewUrlParser: true,
      useUnifiedTopology: true,
      serverSelectionTimeoutMS: 5000,
    });

    console.log("Successfully connected to MongoDB");
    console.log("Database name:", mongoose.connection.name);
    console.log("Connection state:", mongoose.connection.readyState);
  } catch (err) {
    console.error("MongoDB connection error details:", {
      name: err.name,
      message: err.message,
      code: err.code,
      stack: err.stack,
    });
    process.exit(1);
  }
};

// Connect to MongoDB
connectToDatabase();

// Database connection event handlers
mongoose.connection.on("error", (err) => {
  console.error("MongoDB connection error:", err);
});

mongoose.connection.on("disconnected", () => {
  console.log("MongoDB disconnected. Attempting to reconnect...");
  setTimeout(connectToDatabase, 5000);
});

// ===== ROUTES SETUP =====
// API routes
app.use("/api/recipes", recipeRoutes);
app.use("/api/auth", authRoutes);

// Root route for API health check
app.get("/", (req, res) => {
  res.status(200).json({ message: "API is running" });
});

// Route not found handler
app.use((req, res, next) => {
  res.status(404).json({
    message: "Route not found",
    path: req.originalUrl,
  });
});

// ===== ERROR HANDLING =====
// Global error handler
app.use((err, req, res, next) => {
  console.error("Error details:", {
    message: err.message,
    stack: err.stack,
    name: err.name,
    path: req.originalUrl,
    method: req.method,
  });

  const statusCode = err.statusCode || 500;

  res.status(statusCode).json({
    message: err.message || "Something went wrong!",
    statusCode: statusCode,
    error: process.env.NODE_ENV === "development" ? err.stack : undefined,
  });
});

// ===== SERVER STARTUP =====
const server = app.listen(PORT, () => {
  console.log(`Server is running on http://localhost:${PORT}`);
  console.log(`Environment: ${process.env.NODE_ENV || "development"}`);
});

// Handle server shutdown gracefully
process.on("SIGTERM", () => {
  console.log("SIGTERM received. Shutting down gracefully...");
  server.close(() => {
    console.log("Server closed.");
    mongoose.connection.close(false, () => {
      console.log("MongoDB connection closed.");
      process.exit(0);
    });
  });
});

module.exports = app; // For testing purposes
