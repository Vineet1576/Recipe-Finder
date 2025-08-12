// ===============================================
// File: controllers/mealPlannerController.js
// Description: Logic for handling meal planner API requests.
// ===============================================

const MealPlan = require('../Models/MealPlan');
// -- Meal Plan Controllers --

// @desc    Get all meal plans
// @route   GET /api/meal-planner/meals
// @access  Public
exports.getWeeklyMealPlan = async (req, res) => {
  try {
    const mealPlans = await MealPlan.find().sort({ createdAt: 1 });
    res.json(mealPlans);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

// @desc    Add a new meal plan entry
// @route   POST /api/meal-planner/meals
// @access  Public
exports.createMealPlan = async (req, res) => {
  const { day, breakfast, lunch, dinner } = req.body;
  const newMealPlan = new MealPlan({ day, breakfast, lunch, dinner });

  try {
    const savedMealPlan = await newMealPlan.save();
    res.status(201).json(savedMealPlan);
  } catch (error) {
    res.status(400).json({ message: error.message });
  }
};

// @desc    Update a meal plan entry
// @route   PUT /api/meal-planner/meals/:id
// @access  Public
exports.updateMealPlan = async (req, res) => {
  try {
    const updatedMealPlan = await MealPlan.findByIdAndUpdate(req.params.id, req.body, { new: true, runValidators: true });
    if (!updatedMealPlan) {
      return res.status(404).json({ message: 'Meal plan not found' });
    }
    res.json(updatedMealPlan);
  } catch (error) {
    res.status(400).json({ message: error.message });
  }
};

// @desc    Delete a meal plan entry
// @route   DELETE /api/meal-planner/meals/:id
// @access  Public
exports.deleteMealPlan = async (req, res) => {
  try {
    const mealPlan = await MealPlan.findByIdAndDelete(req.params.id);
    if (!mealPlan) {
      return res.status(404).json({ message: 'Meal plan not found' });
    }
    res.json({ message: 'Meal plan deleted' });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};