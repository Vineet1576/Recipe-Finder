// ===============================================
// File: routes/mealPlannerRoutes.js
// Description: Express routes for the meal planner endpoints.
// ===============================================

const express = require('express');
const router = express.Router();
const mealPlannerController = require('../Controllers/mealPlannerController');

// Meal Planner Routes
router.get('/meals', mealPlannerController.getWeeklyMealPlan);
router.post('/meals', mealPlannerController.createMealPlan);
router.put('/meals/:id', mealPlannerController.updateMealPlan);
router.delete('/meals/:id', mealPlannerController.deleteMealPlan);

module.exports = router;