// ===============================================
// File: models/MealPlan.js
// Description: Mongoose model for a meal plan entry.
// ===============================================

const mongoose = require('mongoose');

const mealPlanSchema = new mongoose.Schema({
    day: {
        type: String,
        required: true,
        enum: ['Monday', 'Tuesday', 'Wednesday', 'Thursday', 'Friday', 'Saturday', 'Sunday'],
    },
    breakfast: {
        type: String,
        required: true,
    },
    lunch: {
        type: String,
        required: true,
    },
    dinner: {
        type: String,
        required: true,
    },
    createdAt: {
        type: Date,
        default: Date.now,
        expires: 60 * 60 * 24 * 7 // 1 week in seconds
    },
});

const MealPlan = mongoose.model('MealPlan', mealPlanSchema);

module.exports = MealPlan;
