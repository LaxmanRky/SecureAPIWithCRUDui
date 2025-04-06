/**
 * File: recipeController.js
 * Student's Name: Manoj Bishwakarma, Laxman Rokaya
 * StudentID: 200544391, 200544400
 * Date: April 6, 2024
 */

const Recipe = require("../models/Recipe");

// Get all recipes
exports.getAllRecipes = async (req, res) => {
  try {
    const recipes = await Recipe.find();
    res.json(recipes);
  } catch (error) {
    res.status(500).json({ message: "Error fetching recipes" });
  }
};

// Get a single recipe
exports.getRecipeById = async (req, res) => {
  try {
    const recipe = await Recipe.findById(req.params.id);
    if (!recipe) {
      return res.status(404).json({ message: "Recipe not found" });
    }
    res.json(recipe);
  } catch (error) {
    res.status(500).json({ message: "Error fetching recipe" });
  }
};

// Create a recipe
exports.createRecipe = async (req, res) => {
  try {
    const recipe = new Recipe({
      ...req.body,
      createdBy: req.user._id // Add the user ID from the auth middleware
    });
    await recipe.save();
    res.status(201).json(recipe);
  } catch (error) {
    res.status(400).json({ message: "Error creating recipe", error: error.message });
  }
};

// Update a recipe
exports.updateRecipe = async (req, res) => {
  try {
    const recipe = await Recipe.findById(req.params.id);
    if (!recipe) {
      return res.status(404).json({ message: "Recipe not found" });
    }

    // Check if user owns the recipe
    if (recipe.createdBy.toString() !== req.user._id.toString()) {
      return res.status(403).json({ message: "Not authorized to update this recipe" });
    }

    const updatedRecipe = await Recipe.findByIdAndUpdate(
      req.params.id,
      req.body,
      { new: true, runValidators: true }
    );
    res.json(updatedRecipe);
  } catch (error) {
    res.status(400).json({ message: "Error updating recipe", error: error.message });
  }
};

// Delete a recipe
exports.deleteRecipe = async (req, res) => {
  try {
    const recipe = await Recipe.findById(req.params.id);
    if (!recipe) {
      return res.status(404).json({ message: "Recipe not found" });
    }

    // Check if user owns the recipe
    if (recipe.createdBy.toString() !== req.user._id.toString()) {
      return res.status(403).json({ message: "Not authorized to delete this recipe" });
    }

    await Recipe.findByIdAndDelete(req.params.id);
    res.json({ message: "Recipe deleted successfully" });
  } catch (error) {
    res.status(500).json({ message: "Error deleting recipe" });
  }
};
