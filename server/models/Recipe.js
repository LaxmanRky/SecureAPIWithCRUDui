/**
 * File: Recipe.js
 * Student's Name: Manoj Bishwakarma, Laxman Rokaya
 * StudentID: 200544391, 200544400
 * Date: April 6, 2024
 */

const mongoose = require("mongoose");

/**
 * Recipe Schema - defines the structure for recipe documents in MongoDB
 * @typedef {Object} RecipeSchema
 * @property {string} recipeName - Name of the recipe
 * @property {string} description - Description of the recipe
 * @property {Array<string>} ingredients - List of ingredients required
 * @property {Array<string>} instructions - Step-by-step cooking instructions
 * @property {number} cookingTime - Time needed to prepare the recipe in minutes
 * @property {string} difficulty - Difficulty level (Easy, Medium, Hard)
 * @property {string} cuisine - Type or origin of cuisine
 * @property {string} photoLink - URL to a photo of the prepared recipe
 * @property {number} averageRating - Average user rating from 0-5
 * @property {Date} createdAt - Timestamp when the recipe was created
 * @property {Date} updatedAt - Timestamp when the recipe was last updated
 */
const recipeSchema = new mongoose.Schema(
  {
    recipeName: {
      type: String,
      required: true,
      trim: true,
    },
    description: {
      type: String,
      required: true,
    },
    ingredients: [
      {
        type: String,
        required: true,
      },
    ],
    instructions: [
      {
        type: String,
      },
    ],
    cookingTime: {
      type: Number,
      required: true,
      min: 0,
    },
    difficulty: {
      type: String,
      required: true,
      enum: ["Easy", "Medium", "Hard"],
    },
    cuisine: {
      type: String,
      required: true,
    },
    photoLink: {
      type: String,
      required: true,
    },
    averageRating: {
      type: Number,
      default: 0,
      min: 0,
      max: 5,
    },
  },
  {
    timestamps: true,
  }
);

module.exports = mongoose.model("Recipe", recipeSchema);
