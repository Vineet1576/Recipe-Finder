const mongoose = require('mongoose');

const PositionSchema = new mongoose.Schema({
    className: String,
    title: String,
    tags: [String],
    desc: String,
    skills: [String],
    meta: String
});

module.exports = mongoose.model('Position', PositionSchema);
