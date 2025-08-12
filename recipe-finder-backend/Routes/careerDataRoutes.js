const express = require('express');
const router = express.Router();
const careerController = require('../Controllers/careerDataController');

router.get('/positions', careerController.getPositions);
router.get('/interview-steps', careerController.getInterviewSteps);

module.exports = router;
