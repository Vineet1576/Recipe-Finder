// @desc    Get the latest user goals (for demo, returns the first found)
// @route   GET /api/nutrition/goals
// @access  Public
exports.getUserGoals = async (req, res) => {
  try {
    // In a real app, filter by userId from auth/session
    const userGoals = await UserGoals.findOne();
    if (!userGoals) return res.json({});
    res.json(userGoals);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};
// ===============================================
// File: controllers/nutritionController.js
// Description: Logic for handling nutrition-related API requests.
// ===============================================

const UserGoals = require('../Models/UserGoals');
const NutritionEntry = require('../Models/NutritionEntry');

// @desc    Calculate and save TDEE and user goals
// @route   POST /api/nutrition/goals
// @access  Public
exports.calculateAndSaveGoals = async (req, res) => {
  const { userId, gender, age, height, weight, activityLevel, goal } = req.body;
  try {
    let bmr = 0;
    if (gender === "male") {
      bmr = 88.36 + (13.4 * weight) + (4.8 * height) - (5.7 * age);
    } else {
      bmr = 447.6 + (9.2 * weight) + (3.1 * height) - (4.3 * age);
    }
    const tdeeValue = bmr * activityLevel;

    let goalCal = tdeeValue;
    if (goal === "lose") {
      goalCal = tdeeValue - 500; // Calorie deficit
    } else if (goal === "gain") {
      goalCal = tdeeValue + 500; // Calorie surplus
    }

    const newGoals = {
      userId,
      gender,
      age,
      height,
      weight,
      activityLevel,
      goal,
      tdee: tdeeValue.toFixed(0),
      goalCalories: goalCal.toFixed(0),
    };

    const userGoals = await UserGoals.findOneAndUpdate({ userId }, newGoals, {
      new: true,
      upsert: true, // Create a new document if one doesn't exist
    });

    res.json(userGoals);
  } catch (error) {
    res.status(400).json({ message: error.message });
  }
};

// @desc    Track a new nutrition entry for a user
// @route   POST /api/nutrition/track
// @access  Public
exports.trackNutrition = async (req, res) => {
  const { userId, calories, protein, carbs, fat } = req.body;
  try {
    const newEntry = new NutritionEntry({ userId, calories, protein, carbs, fat });
    await newEntry.save();
    res.status(201).json({ message: 'Nutrition entry tracked successfully' });
  } catch (error) {
    res.status(400).json({ message: error.message });
  }
};

// @desc    Get nutrition history for a user
// @route   GET /api/nutrition/:userId/history
// @access  Public
exports.getNutritionHistory = async (req, res) => {
  try {
    const history = await NutritionEntry.find({ userId: req.params.userId }).sort({ date: 1 }).limit(7);
    res.json(history);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

// @desc    Clear nutrition history for a user
// @route   DELETE /api/nutrition/:userId/history
// @access  Public
exports.clearNutritionHistory = async (req, res) => {
  try {
    await NutritionEntry.deleteMany({ userId: req.params.userId });
    res.json({ message: 'Nutrition history cleared successfully' });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};
