// @desc    Get all recipes liked by a user
// @route   GET /api/recipes/liked/:userId
// @access  Public
exports.getLikedRecipesByUser = async (req, res) => {
  try {
    const userId = req.params.userId;
    // Find all recipes where likesUsers contains userId
    const recipes = await Recipe.find({ likesUsers: userId });
    res.json(recipes);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};
// ===============================================
// File: controllers/recipeController.js
// Description: Logic for handling recipe-related API requests.
// ===============================================

const Recipe = require('../Models/recipeModal');

// @desc    Get all recipes, with optional search and tag filters
// @route   GET /api/recipes
// @access  Public
exports.getAllRecipes = async (req, res) => {
  try {
    const { tags, search } = req.query;
    let query = {};

    if (tags) {
      // Find recipes that have the specified tag
      query.tags = tags;
    }

    if (search) {
      // Find recipes where the title contains the search string (case-insensitive)
      query.title = { $regex: search, $options: 'i' };
    }

    const recipes = await Recipe.find(query);
    res.json(recipes);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

// @desc    Get a single recipe by ID
// @route   GET /api/recipes/:id
// @access  Public
exports.getRecipeById = async (req, res) => {
  try {
    const recipe = await Recipe.findById(req.params.id);
    if (!recipe) {
      return res.status(404).json({ message: 'Recipe not found' });
    }
    res.json(recipe);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

// @desc    Get a random recipe (Recipe of the Day)
// @route   GET /api/recipes/daily
// @access  Public
exports.getRecipeOfTheDay = async (req, res) => {
  try {
    const count = await Recipe.countDocuments();
    const random = Math.floor(Math.random() * count);
    const recipe = await Recipe.findOne().skip(random);

    if (!recipe) {
      return res.status(404).json({ message: 'No recipes found' });
    }
    res.json(recipe);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

// @desc    (Optional) Add a new recipe to the database
// @route   POST /api/recipes
// @access  Public
exports.createRecipe = async (req, res) => {
  const newRecipe = new Recipe({
    title: req.body.title,
    description: req.body.description,
    image: req.body.image, // should be a URL string
    tags: req.body.tags,
    ingredients: req.body.ingredients,
    instructions: req.body.instructions,
    rating: req.body.rating,
    chefName: req.body.chefName,
    chefImage: req.body.chefImage,
    difficulty: req.body.difficulty,
    prepTime: req.body.prepTime,
    cookingTime: req.body.cookingTime, // ensure cookingTime is stored
    serving: req.body.serving,
  });

  try {
    const savedRecipe = await newRecipe.save();
    res.status(201).json(savedRecipe);
  } catch (error) {
    res.status(400).json({ message: error.message });
  }
};

// @desc    Like or unlike a recipe
// @route   POST /api/recipes/:id/like
// @access  Public
exports.likeRecipe = async (req, res) => {
  try {
    const recipe = await Recipe.findById(req.params.id);
    if (!recipe) {
      return res.status(404).json({ message: 'Recipe not found' });
    }
    // Toggle like: expects { like: true/false, userId: string } in body
    const userId = req.body.userId;
    if (!userId) {
      return res.status(400).json({ message: 'userId is required' });
    }
    let likes = recipe.likes || 0;
    let likesUsers = recipe.likesUsers || [];
    if (req.body.like === false && likes > 0) {
      likes -= 1;
      // Remove userId from likesUsers
      likesUsers = likesUsers.filter(id => id !== userId);
    } else if (req.body.like === true) {
      if (!likesUsers.includes(userId)) {
        likes += 1;
        likesUsers.push(userId);
      }
    }
    recipe.likes = likes;
    recipe.likesUsers = likesUsers;
    await recipe.save();
    res.json({ likes: recipe.likes, likesUsers: recipe.likesUsers });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

// @desc    Rate a recipe
// @route   POST /api/recipes/:id/rate
// @access  Public
exports.rateRecipe = async (req, res) => {
  try {
    const recipe = await Recipe.findById(req.params.id);
    if (!recipe) {
      return res.status(404).json({ message: 'Recipe not found' });
    }
    // Store ratings as an array of numbers (or create if not present)
    if (!recipe.ratings) recipe.ratings = [];
    if (typeof req.body.rating === 'number' && req.body.rating >= 1 && req.body.rating <= 5) {
      recipe.ratings.push(req.body.rating);
      // Calculate average
      const sum = recipe.ratings.reduce((a, b) => a + b, 0);
      recipe.rating = sum / recipe.ratings.length;
      recipe.reviews = recipe.ratings.length;
      await recipe.save();
      res.json({ rating: recipe.rating, reviews: recipe.reviews });
    } else {
      res.status(400).json({ message: 'Invalid rating value' });
    }
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};