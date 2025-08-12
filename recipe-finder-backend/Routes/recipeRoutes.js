
// ===============================================
// File: routes/recipeRoutes.js
// Description: Express routes for recipe endpoints.
// ===============================================

const express = require('express');
const router = express.Router();
const recipeController = require('../Controllers/recipeController');

// Get all recipes liked by a user
router.get('/liked/:userId', recipeController.getLikedRecipesByUser);

// GET all recipes (with optional search and tag filters)
router.get('/', recipeController.getAllRecipes);

// GET a specific recipe by ID
router.get('/:id', recipeController.getRecipeById);

// GET the "Recipe of the Day"
router.get('/daily', recipeController.getRecipeOfTheDay);

// POST a new recipe (for adding data)
router.post('/', recipeController.createRecipe);


// Like/unlike a recipe
router.post('/:id/like', recipeController.likeRecipe);

// Rate a recipe
router.post('/:id/rate', recipeController.rateRecipe);

module.exports = router;
