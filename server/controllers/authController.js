/**
 * File: authController.js
 * Student's Name: Manoj Bishwakarma, Laxman Rokaya
 * StudentID: 200544391, 200544400
 * Date: April 6, 2024
 */

const User = require("../models/User");
const jwt = require("jsonwebtoken");

/**
 * Register a new user
 * @param {Object} req - Express request object containing user registration data
 * @param {Object} req.body - Request body with user credentials
 * @param {string} req.body.username - User's unique username
 * @param {string} req.body.email - User's unique email address
 * @param {string} req.body.password - User's password (will be hashed)
 * @param {Object} res - Express response object
 * @returns {Object} JSON response with token or error message
 */
exports.register = async (req, res) => {
  try {
    const { username, email, password } = req.body;

    // Validate required fields
    if (!username || !email || !password) {
      return res.status(400).json({
        message: "Missing required fields",
        details: {
          username: !username ? "Username is required" : null,
          email: !email ? "Email is required" : null,
          password: !password ? "Password is required" : null,
        },
      });
    }

    // Check if user already exists
    const existingUser = await User.findOne({
      $or: [{ email }, { username }],
    });

    if (existingUser) {
      return res.status(400).json({
        message: "User already exists",
        field: existingUser.email === email ? "email" : "username",
      });
    }

    // Create new user
    const user = new User({ username, email, password });
    await user.save();

    // Generate token
    const token = jwt.sign(
      { _id: user._id, username: user.username },
      process.env.JWT_SECRET,
      { expiresIn: "24h" }
    );

    res.status(201).json({ token });
  } catch (error) {
    // Handle mongoose validation errors
    if (error.name === "ValidationError") {
      return res.status(400).json({
        message: "Validation error",
        errors: Object.keys(error.errors).reduce((acc, key) => {
          acc[key] = error.errors[key].message;
          return acc;
        }, {}),
      });
    }

    // Handle duplicate key errors
    if (error.code === 11000) {
      const field = Object.keys(error.keyPattern)[0];
      return res.status(400).json({
        message: `${field} already exists`,
        field: field,
      });
    }

    res.status(500).json({
      message: "Error registering user",
      error: process.env.NODE_ENV === "development" ? error.message : undefined,
    });
  }
};

/**
 * Authenticate and login a user
 * @param {Object} req - Express request object containing login credentials
 * @param {Object} req.body - Request body with login data
 * @param {string} req.body.email - User's email address
 * @param {string} req.body.password - User's password
 * @param {Object} res - Express response object
 * @returns {Object} JSON response with token or error message
 */
exports.login = async (req, res) => {
  try {
    const { email, password } = req.body;

    // Find user
    const user = await User.findOne({ email });
    if (!user) {
      return res.status(401).json({ message: "Invalid credentials" });
    }

    // Check password
    const isMatch = await user.comparePassword(password);
    if (!isMatch) {
      return res.status(401).json({ message: "Invalid credentials" });
    }

    // Generate token
    const token = jwt.sign(
      { _id: user._id, username: user.username },
      process.env.JWT_SECRET,
      { expiresIn: "24h" }
    );

    res.json({ token });
  } catch (error) {
    res.status(500).json({ message: "Error logging in", error: error.message });
  }
};
