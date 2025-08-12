// ===============================================
// File: models/Member.js
// Description: Mongoose model for a member's profile.
// ===============================================

const mongoose = require('mongoose');

const memberSchema = new mongoose.Schema({
  name: {
    type: String,
    required: true,
    trim: true,
  },
  email: {
    type: String,
    required: true,
    unique: true,
    lowercase: true,
  },
  username: {
    type: String,
    required: true,
    unique: true,
    trim: true,
  },
  password: {
    type: String,
    required: true,
  },
  role: {
    type: String,
    required: true,
    enum: ['home-cook', 'chef', 'nutritionist', 'food-blogger', 'other'],
  },
  bio: {
    type: String,
    default: '',
  },
  preferences: {
    type: String,
    default: '',
  },
  userId: {
    type: String,
    required: true,
    unique: true
  },
  recipesPosted: {
    type: Number,
    default: 0
  },
  level: {
    type: String,
    default: 'Beginner'
  },
  avatar: {
    type: String,
    default: '',
  },
  createdAt: {
    type: Date,
    default: Date.now,
  },
  updatedAt: {
    type: Date,
    default: Date.now,
  }
});

// Update the updatedAt field before saving
memberSchema.pre('save', function (next) {
  this.updatedAt = Date.now();
  next();
});

const Member = mongoose.model('Member', memberSchema);

module.exports = Member;