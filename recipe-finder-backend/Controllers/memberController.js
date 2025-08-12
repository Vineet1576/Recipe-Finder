// @desc    Post a new recipe and increment user's recipesPosted
// @route   POST /api/members/recipes
// @access  Public
const Recipe = require('../Models/recipeModal');
exports.postRecipe = async (req, res) => {
  try {
    const { authorId } = req.body;
    const recipe = new Recipe(req.body);
    await recipe.save();
    // Increment recipesPosted for the user
    await Member.findOneAndUpdate(
      { userId: authorId },
      { $inc: { recipesPosted: 1 } },
      { upsert: true }
    );
    res.status(201).json({ message: 'Recipe posted successfully' });
  } catch (error) {
    res.status(400).json({ message: error.message });
  }
};
// ===============================================
// File: controllers/memberController.js
// Description: Logic for handling member-related API requests.
// ===============================================

const Member = require('../Models/Member');
const Feedback = require('../Models/feedbackModal');
// Removed CommunityRecipe imports
// @desc    Get user stats/profile (for Members page dashboard)
// @route   GET /api/members/:userId
// @access  Public
// getUserStats removed; use getMemberProfile only

// @desc    Get member's user stats and profile data
// @route   GET /api/members/:userId
// @access  Public
exports.getMemberProfile = async (req, res) => {
  try {
    const member = await Member.findOne({ userId: req.params.userId });
    if (!member) {
      // Return default stats if not found
      return res.json({ recipesPosted: 0, challengesCompleted: 0, points: 0, level: '' });
    }
    // Return only the stats needed by the frontend
    res.json({
      recipesPosted: member.recipesPosted || 0,
      challengesCompleted: member.challengesCompleted || 0,
      points: member.points || 0,
      level: member.level || ''
    });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

// @desc    Submit user feedback
// @route   POST /api/members/feedback
// @access  Public
exports.submitFeedback = async (req, res) => {
  const { userId, rating, comment } = req.body;
  try {
    const newFeedback = new Feedback({ userId, rating, comment });
    await newFeedback.save();
    res.status(201).json({ message: 'Feedback submitted successfully' });
  } catch (error) {
    res.status(400).json({ message: error.message });
  }
};
