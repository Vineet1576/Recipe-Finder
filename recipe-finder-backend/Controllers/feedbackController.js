const Feedback = require('../Models/feedbackModal');

// POST /api/feedback
exports.createFeedback = async (req, res) => {
  try {
    const { userName, userEmail, rating, comment, userRole, category } = req.body;
    if (!userName || !userEmail) {
      return res.status(400).json({ error: 'Name and email are required.' });
    }
    const feedback = new Feedback({ userName, userEmail, rating, comment, userRole, category });
    await feedback.save();
    res.status(201).json({ message: 'Feedback submitted', feedback });
  } catch (err) {
    res.status(500).json({ error: 'Failed to submit feedback' });
  }
};

// GET /api/feedback
exports.getAllFeedback = async (req, res) => {
  try {
    const feedbacks = await Feedback.find().sort({ createdAt: -1 });
    res.json(feedbacks);
  } catch (err) {
    res.status(500).json({ error: 'Failed to fetch feedback' });
  }
};
