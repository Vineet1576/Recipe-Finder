const Macronutrient = require('../Models/Macronutrient');
const Micronutrient = require('../Models/Micronutrient');
const HydrationTip = require('../Models/HydrationTip');
const FAQ = require('../Models/FAQ');

exports.getMacronutrients = async (req, res) => {
  const data = await Macronutrient.find();
  res.json(data);
};

exports.getMicronutrients = async (req, res) => {
  const data = await Micronutrient.find();
  res.json(data);
};

exports.getHydrationTips = async (req, res) => {
  const data = await HydrationTip.find();
  res.json(data);
};

exports.getFAQs = async (req, res) => {
  const data = await FAQ.find();
  res.json(data);
};
