/**
 * File: authRoutes.js
 * Student's Name: Manoj Bishwakarma, Laxman Rokaya
 * StudentID: 200544391, 200544400
 * Date: April 6, 2024
 */

const express = require("express");
const router = express.Router();
const { register, login } = require("../controllers/authController");

// Auth routes
router.post("/register", register);
router.post("/login", login);

module.exports = router;
