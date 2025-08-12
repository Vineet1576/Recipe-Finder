const mongoose = require('mongoose');

const HydrationTipSchema = new mongoose.Schema({
  title: String,
  icon: String,
  desc: String
});

module.exports = mongoose.model('HydrationTip', HydrationTipSchema);