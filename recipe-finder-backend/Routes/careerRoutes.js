// ===============================================
// File: routes/careerRoutes.js
// Description: Express routes for career endpoints.
// ===============================================

const express = require('express');
const router = express.Router();
const careerController = require('../Controllers/careerController');

// POST route for submitting a new job application
router.post('/apply', careerController.submitApplication);

// GET route to fetch all applications (protected in a real app)
router.get('/applications', careerController.getApplications);

module.exports = router;