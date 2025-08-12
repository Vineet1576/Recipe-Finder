const express = require('express');
const router = express.Router();
const controller = require('../Controllers/nutritionDataController');

router.get('/macronutrients', controller.getMacronutrients);
router.get('/micronutrients', controller.getMicronutrients);
router.get('/hydration-tips', controller.getHydrationTips);
router.get('/faqs', controller.getFAQs);

module.exports = router;
