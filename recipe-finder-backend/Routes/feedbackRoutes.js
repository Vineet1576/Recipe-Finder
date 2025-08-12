const express = require('express');
const router = express.Router();
const feedbackController = require('../Controllers/feedbackController');

// POST /api/feedback
router.post('/', feedbackController.createFeedback);

// GET /api/feedback
router.get('/', feedbackController.getAllFeedback);

module.exports = router;
