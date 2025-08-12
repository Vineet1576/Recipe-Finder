// ===============================================
// File: routes/memberRoutes.js
// Description: Express routes for member-related endpoints.
// ===============================================

const express = require('express');
const router = express.Router();
const memberController = require('../Controllers/memberController');

// Recipe posting
router.post('/recipes', memberController.postRecipe);

// Profile and Stats
router.get('/:userId', memberController.getMemberProfile);

// Feedback
router.post('/feedback', memberController.submitFeedback);

// Removed routes for community recipes

module.exports = router;
