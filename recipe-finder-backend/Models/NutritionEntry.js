// ===============================================
// File: models/NutritionEntry.js
// Description: Mongoose model for daily nutrition tracking.
// ===============================================

const mongoose = require('mongoose');

const nutritionEntrySchema = new mongoose.Schema({
    userId: {
        type: String,
        required: true,
    },
    calories: {
        type: Number,
        required: true,
    },
    protein: {
        type: Number,
        required: true,
    },
    carbs: {
        type: Number,
        required: true,
    },
    fat: {
        type: Number,
        required: true,
    },
    date: {
        type: Date,
        default: Date.now,
    },
});

const NutritionEntry = mongoose.model('NutritionEntry', nutritionEntrySchema);

module.exports = NutritionEntry;
