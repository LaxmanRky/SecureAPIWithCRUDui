/**
 * File: recipeRoutes.js
 * Student's Name: Manoj Bishwakarma, Laxman Rokaya
 * StudentID: 200544391, 200544400
 * Date: April 6, 2024
 */

const express = require("express");
const router = express.Router();
const auth = require("../middleware/auth");
const {
  getAllRecipes,
  getRecipeById,
  createRecipe,
  updateRecipe,
  deleteRecipe
} = require("../controllers/recipeController");

// All routes are protected with JWT auth middleware
router.get("/", auth, getAllRecipes);
router.get("/:id", auth, getRecipeById);
router.post("/", auth, createRecipe);
router.put("/:id", auth, updateRecipe);
router.delete("/:id", auth, deleteRecipe);

module.exports = router;
