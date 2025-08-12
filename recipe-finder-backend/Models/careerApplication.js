// ===============================================
// File: models/Application.js
// Description: Mongoose model for a job application.
// ===============================================

const mongoose = require('mongoose');

const applicationSchema = new mongoose.Schema({
  name: {
    type: String,
    required: true,
    trim: true,
  },
  email: {
    type: String,
    required: true,
    trim: true,
  },
  password: { // NOTE: In a real-world app, passwords should be hashed and salted.
    type: String,
    required: true,
  },
  preferences: {
    type: String,
    trim: true,
  },
  appliedAt: {
    type: Date,
    default: Date.now,
  },
});

const Application = mongoose.model('Application', applicationSchema);

module.exports = Application;