const mongoose = require('mongoose');

const FAQSchema = new mongoose.Schema({
  q: String,
  a: String
});

module.exports = mongoose.model('FAQ', FAQSchema);
