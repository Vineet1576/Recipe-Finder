const express = require('express');
const router = express.Router();

const authRoute = require('./authRoutes');
const recipeRoutes = require('./recipeRoutes');
const mealPlannerRoutes = require('./mealPlannerRoutes');
const nutritionRoutes = require('./nutritionRoutes');
const memberRoutes = require('./memberRoutes');
const careerRoutes = require('./careerRoutes');
const feedbackRoutes = require('./feedbackRoutes');
const communityRoutes = require('./communityRoutes');
const nutritionDataRoutes = require('./nutritionDataRoutes');
const careerDataRoutes = require('./careerDataRoutes');

router.use('/auth', authRoute);
router.use('/recipes', recipeRoutes);
router.use('/meal-planner', mealPlannerRoutes);
router.use('/nutrition', nutritionRoutes);
router.use('/members', memberRoutes);
router.use('/career', careerRoutes);
router.use('/feedback', feedbackRoutes);
router.use('/community', communityRoutes);
router.use('/nutritionData', nutritionDataRoutes);
router.use('/careerData', careerDataRoutes);

const contactController = require('../Controllers/contactController');
router.post('/contact', contactController.sendContactMessage);

module.exports = router;