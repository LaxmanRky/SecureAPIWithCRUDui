/**
 * File: recipeController.js
 * Student's Name: Manoj Bishwakarma, Laxman Rokaya
 * StudentID: 200544391, 200544400
 * Date: April 6, 2024
 */

const Recipe = require("../models/Recipe");

/**
 * Retrieve all recipes from the database
 * @param {Object} req - Express request object
 * @param {Object} res - Express response object
 * @returns {Object} JSON array of all recipes or error message
 */
exports.getAllRecipes = async (req, res) => {
  try {
    const recipes = await Recipe.find();
    res.json(recipes);
  } catch (error) {
    res.status(500).json({ message: "Error fetching recipes" });
  }
};

/**
 * Retrieve a single recipe by ID
 * @param {Object} req - Express request object
 * @param {string} req.params.id - Recipe ID to retrieve
 * @param {Object} res - Express response object
 * @returns {Object} JSON object of the requested recipe or error message
 */
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

/**
 * Create a new recipe
 * @param {Object} req - Express request object
 * @param {Object} req.body - Recipe data to create
 * @param {string} req.body.recipeName - Name of the recipe
 * @param {string} req.body.description - Description of the recipe
 * @param {Array<string>} req.body.ingredients - List of ingredients
 * @param {Array<string>} req.body.instructions - List of instructions
 * @param {number} req.body.cookingTime - Cooking time in minutes
 * @param {string} req.body.difficulty - Recipe difficulty level (Easy, Medium, Hard)
 * @param {string} req.body.cuisine - Type of cuisine
 * @param {string} req.body.photoLink - URL to recipe photo
 * @param {Object} res - Express response object
 * @returns {Object} JSON object of the created recipe or error message
 */
exports.createRecipe = async (req, res) => {
  try {
    const recipe = new Recipe(req.body);
    await recipe.save();
    res.status(201).json(recipe);
  } catch (error) {
    res
      .status(400)
      .json({ message: "Error creating recipe", error: error.message });
  }
};

/**
 * Update an existing recipe
 * @param {Object} req - Express request object
 * @param {string} req.params.id - Recipe ID to update
 * @param {Object} req.body - Updated recipe data
 * @param {Object} res - Express response object
 * @returns {Object} JSON object of the updated recipe or error message
 */
exports.updateRecipe = async (req, res) => {
  try {
    const recipe = await Recipe.findById(req.params.id);
    if (!recipe) {
      return res.status(404).json({ message: "Recipe not found" });
    }

    const updatedRecipe = await Recipe.findByIdAndUpdate(
      req.params.id,
      req.body,
      { new: true, runValidators: true }
    );
    res.json(updatedRecipe);
  } catch (error) {
    res
      .status(400)
      .json({ message: "Error updating recipe", error: error.message });
  }
};

/**
 * Delete a recipe by ID
 * @param {Object} req - Express request object
 * @param {string} req.params.id - Recipe ID to delete
 * @param {Object} res - Express response object
 * @returns {Object} JSON confirmation message or error message
 */
exports.deleteRecipe = async (req, res) => {
  try {
    const recipe = await Recipe.findById(req.params.id);
    if (!recipe) {
      return res.status(404).json({ message: "Recipe not found" });
    }

    await Recipe.findByIdAndDelete(req.params.id);
    res.json({ message: "Recipe deleted successfully" });
  } catch (error) {
    res.status(500).json({ message: "Error deleting recipe" });
  }
};
