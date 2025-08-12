// ===============================================
// File: controllers/careerController.js
// Description: Logic for handling job application submissions.
// ===============================================

const Application = require('../Models/careerApplication');

// @desc    Submit a new job application
// @route   POST /api/career/apply
// @access  Public
exports.submitApplication = async (req, res) => {
  const { name, email, password, preferences } = req.body;

  // Simple validation
  if (!name || !email || !password) {
    return res.status(400).json({ message: 'Name, email, and password are required.' });
  }

  // NOTE: In a real-world app, you would add more robust validation, password hashing, and error handling.
  try {
    const newApplication = new Application({
      name,
      email,
      password,
      preferences,
    });

    const savedApplication = await newApplication.save();
    res.status(201).json({ 
      message: 'Application submitted successfully!',
      applicationId: savedApplication._id
    });
  } catch (error) {
    res.status(500).json({ message: 'Server error. Could not save application.' });
  }
};


// @desc    (Optional) Get all job applications
// @route   GET /api/career/applications
// @access  Private (e.g., for internal recruiters)
exports.getApplications = async (req, res) => {
  try {
    const applications = await Application.find().sort({ appliedAt: -1 });
    res.json(applications);
  } catch (error) {
    res.status(500).json({ message: 'Server error. Could not fetch applications.' });
  }
};