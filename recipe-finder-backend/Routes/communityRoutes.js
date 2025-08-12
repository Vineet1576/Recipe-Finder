// ===============================================
// File: routes/communityRoutes.js
// Description: Express routes for community endpoints.
// ===============================================

const express = require('express');
const router = express.Router();
const communityController = require('../Controllers/communityController');

// POST route for new member registration
router.post('/register', communityController.registerMember);

// POST route for member login
router.post('/login', communityController.loginMember);

// GET route for member profile
router.get('/profile/:userId', communityController.getMemberProfile);

module.exports = router;