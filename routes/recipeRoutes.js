/**
 * File: recipeRoutes.js
 * Student's Name: Manoj Bishwakarma, Laxman Rokaya
 * StudentID: 200544391, 200544400
 * Date: April 6, 2024
 */

const express = require("express");
const router = express.Router();
const {
  getAllRecipes,
  getRecipeById,
  createRecipe,
  updateRecipe,
  deleteRecipe
} = require("../controllers/recipeController");

// Recipe routes
router.get("/", getAllRecipes);
router.get("/:id", getRecipeById);
router.post("/", createRecipe);
router.put("/:id", updateRecipe);
router.delete("/:id", deleteRecipe);

module.exports = router;
