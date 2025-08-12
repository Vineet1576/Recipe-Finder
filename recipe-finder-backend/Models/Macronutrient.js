const mongoose = require('mongoose');

const MacronutrientSchema = new mongoose.Schema({
  title: String,
  icon: String, // You can store the icon name or Unicode and map it on the frontend
  desc: String
});

module.exports = mongoose.model('Macronutrient', MacronutrientSchema);
