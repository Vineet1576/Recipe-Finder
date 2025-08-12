const mongoose = require('mongoose');

const recipeSchema = new mongoose.Schema({
  title: { type: String, required: true, trim: true },
  authorId: { type: String, required: true },
  image: { type: String, default: '' },
  description: { type: String, required: true },
  difficulty: { type: String, default: 'Easy' },
  prepTime: { type: Number, default: 0 },
  cookingTime: { type: Number, default: 0 },
  serving: { type: Number, default: 1 },
  ingredients: { type: [String], default: [] },
  instructions: { type: [String], default: [] },
  tags: { type: [String], default: [] },
  chefName: { type: String, default: 'Anonymous' },
  chefImage: { type: String, default: '' },
  likes: { type: Number, default: 0 },
  likesUsers: { type: [String], default: [] } // Array of userIds who liked this recipe
}, { timestamps: true });

module.exports = mongoose.model('Recipe', recipeSchema);
// ===============================================
// File: models/Recipe.js
// Description: Mongoose model for a recipe document.
// ===============================================