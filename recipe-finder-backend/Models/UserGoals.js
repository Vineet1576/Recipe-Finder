// ===============================================
// File: models/UserGoals.js
// Description: Mongoose model for user's health goals and TDEE.
// ===============================================

const mongoose = require('mongoose');

const userGoalsSchema = new mongoose.Schema({
    createdAt: {
        type: Date,
        default: Date.now,
        expires: 60 * 60 * 24 // 1 day in seconds
    },
    userId: {
        type: String, // You can link this to a User model's _id if you have one
        required: true,
        unique: true,
    },
    gender: {
        type: String,
        enum: ['male', 'female'],
        required: true,
    },
    age: {
        type: Number,
        required: true,
    },
    height: {
        type: Number,
        required: true, // in cm
    },
    weight: {
        type: Number,
        required: true, // in kg
    },
    activityLevel: {
        type: Number,
        required: true,
    },
    goal: {
        type: String,
        enum: ['maintain', 'lose', 'gain'],
        default: 'maintain',
    },
    tdee: {
        type: Number,
        default: 0,
    },
    goalCalories: {
        type: Number,
        default: 0,
    },
});

const UserGoals = mongoose.model('UserGoals', userGoalsSchema);

module.exports = UserGoals;

// (NutritionEntry model removed from this file. See NutritionEntry.js)
