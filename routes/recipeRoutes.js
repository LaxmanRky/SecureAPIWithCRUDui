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

// Secured Recipe routes
router.get("/getAllRecipes", auth, getAllRecipes);
router.get("/getAllRecipes/:id", auth, getRecipeById);
router.post("/createRecipe", auth, createRecipe);
router.put("/updateRecipe/:id", auth, updateRecipe);
router.delete("/deleteRecipe/:id", auth, deleteRecipe);

module.exports = router;
