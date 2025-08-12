// ===============================================
// File: routes/contactRoutes.js
// Description: Express routes for the contact form endpoint.
// ===============================================

const express = require('express');
const router = express.Router();
const contactController = require('../Controllers/contactController');

// POST a new contact form message
router.post('/', contactController.sendContactForm);

module.exports = router;
