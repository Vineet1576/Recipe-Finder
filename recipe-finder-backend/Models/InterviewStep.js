const mongoose = require('mongoose');

const InterviewStepSchema = new mongoose.Schema({
    step: Number,
    title: String,
    desc: String
});

module.exports = mongoose.model('InterviewStep', InterviewStepSchema);
