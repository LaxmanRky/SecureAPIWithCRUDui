const mongoose = require('mongoose');

const recipeSchema = new mongoose.Schema({
    recipeName: {
        type: String,
        required: [true, 'Recipe name is required'],
        trim: true
    },
    ingredients: {
        type: [String],
        required: [true, 'Ingredients are required']
    },
    cookingTime: {
        type: Number,
        required: [true, 'Cooking time is required']
    },
    difficulty: {
        type: String,
        required: [true, 'Difficulty level is required'],
        enum: ['Easy', 'Medium', 'Hard']
    },
    cuisine: {
        type: String,
        required: [true, 'Cuisine type is required'],
        trim: true
    },
    description: {
        type: String,
        required: [true, 'Description is required']
    },
    photoLink: {
        type: String,
        required: [true, 'Photo link is required']
    },
    averageRating: {
        type: Number,
        default: 0,
        min: 0,
        max: 5
    },
    createdBy: {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'User',
        required: true
    }
}, {
    timestamps: true
});

const Recipe = mongoose.model('Recipe', recipeSchema);
module.exports = Recipe;
