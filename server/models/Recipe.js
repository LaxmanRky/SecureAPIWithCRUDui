/**
 * File: Recipe.js
 * Student's Name: Manoj Bishwakarma, Laxman Rokaya
 * StudentID: 200544391, 200544400
 * Date: April 6, 2024
 */

const mongoose = require("mongoose");

const recipeSchema = new mongoose.Schema({
  recipeName: {
    type: String,
    required: true,
    trim: true
  },
  description: {
    type: String,
    required: true
  },
  ingredients: [{
    type: String,
    required: true
  }],
  instructions: [{
    type: String
  }],
  cookingTime: {
    type: Number,
    required: true,
    min: 0
  },
  difficulty: {
    type: String,
    required: true,
    enum: ["Easy", "Medium", "Hard"]
  },
  cuisine: {
    type: String,
    required: true
  },
  photoLink: {
    type: String,
    required: true
  },
  averageRating: {
    type: Number,
    default: 0,
    min: 0,
    max: 5
  }
}, {
  timestamps: true
});

module.exports = mongoose.model("Recipe", recipeSchema);
