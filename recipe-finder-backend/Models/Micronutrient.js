const mongoose = require('mongoose');

const MicronutrientSchema = new mongoose.Schema({
  title: String,
  benefits: String,
  sources: [
    {
      icon: String,
      name: String
    }
  ]
});

module.exports = mongoose.model('Micronutrient', MicronutrientSchema);