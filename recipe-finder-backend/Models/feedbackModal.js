// ===============================================
// File: models/Feedback.js
// Description: Mongoose model for user feedback submissions.
// ===============================================

const mongoose = require('mongoose');

const feedbackSchema = new mongoose.Schema({
  userName: {
    type: String,
    required: true,
  },
  userEmail: {
    type: String,
    required: true,
  },
  rating: {
    type: Number,
    min: 1,
    max: 5,
    required: true,
  },
  comment: {
    type: String,
    required: true,
  },
  userRole: {
    type: String,
    required: false,
    default: 'user',
  },
  category: {
    type: String,
    required: false,
    default: 'general',
  },
  createdAt: {
    type: Date,
    default: Date.now,
  },
});

const Feedback = mongoose.model('Feedback', feedbackSchema);

module.exports = Feedback;