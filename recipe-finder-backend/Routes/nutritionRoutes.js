// ===============================================
// File: routes/nutritionRoutes.js
// Description: Express routes for nutrition-related endpoints.
// ===============================================

const express = require('express');
const router = express.Router();
const nutritionController = require('../Controllers/nutritionController');

// Routes for TDEE and goals
router.get('/goals', nutritionController.getUserGoals);
router.post('/goals', nutritionController.calculateAndSaveGoals);

// Routes for daily nutrition tracking
router.post('/track', nutritionController.trackNutrition);
router.get('/:userId/history', nutritionController.getNutritionHistory);
router.delete('/:userId/history', nutritionController.clearNutritionHistory);

module.exports = router;