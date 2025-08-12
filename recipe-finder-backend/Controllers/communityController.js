// ===============================================
// File: controllers/communityController.js
// Description: Logic for handling community member registration.
// ===============================================

const Member = require('../Models/Member');
const jwt = require('jsonwebtoken');
const bcrypt = require('bcrypt');

// @desc    Register a new community member
// @route   POST /api/community/register
// @access  Public
exports.registerMember = async (req, res) => {
  const { name, email, username, password, role, bio, preferences } = req.body;

  try {
    // Check if the user already exists by email
    let member = await Member.findOne({ email });
    if (member) {
      return res.status(400).json({ message: 'Member with this email already exists' });
    }

    // Check if the username is taken
    member = await Member.findOne({ username });
    if (member) {
      return res.status(400).json({ message: 'This username is already taken' });
    }
    
    // Hash the password
    const salt = await bcrypt.genSalt(10);
    const hashedPassword = await bcrypt.hash(password, salt);

    // Generate userId from email (or you can use MongoDB's _id)
    const userId = email.split('@')[0] + '_' + Date.now();

    const newMember = new Member({
      name,
      email,
      username,
      password: hashedPassword,
      role,
      bio: bio || '',
      preferences: preferences || '',
      userId,
    });

    const savedMember = await newMember.save();

    // Generate JWT token
    const token = jwt.sign(
      { 
        id: savedMember._id,
        email: savedMember.email,
        name: savedMember.name,
        username: savedMember.username,
        role: savedMember.role,
        preferences: savedMember.preferences,
        userId: savedMember.userId
      }, 
      process.env.JWT_SECRET || "hello", 
      { expiresIn: "7d" }
    );

    res.status(201).json({ 
      message: 'Registration successful!',
      token,
      user: {
        id: savedMember._id,
        name: savedMember.name,
        email: savedMember.email,
        username: savedMember.username,
        role: savedMember.role,
        bio: savedMember.bio,
        preferences: savedMember.preferences,
        userId: savedMember.userId,
        recipesPosted: savedMember.recipesPosted,
        challengesCompleted: savedMember.challengesCompleted,
        points: savedMember.points,
        level: savedMember.level
      }
    });
  } catch (error) {
    console.error('Registration error:', error);
    res.status(500).json({ message: error.message });
  }
};

// @desc    Login community member
// @route   POST /api/community/login
// @access  Public
exports.loginMember = async (req, res) => {
  const { email, password } = req.body;

  try {
    // Find member by email
    const member = await Member.findOne({ email });
    if (!member) {
      return res.status(404).json({ message: "Member not found" });
    }

    // Check password
    const isPasswordCorrect = await bcrypt.compare(password, member.password);
    if (!isPasswordCorrect) {
      return res.status(401).json({ message: "Email or password is incorrect" });
    }

    // Generate JWT token
    const token = jwt.sign(
      { 
        id: member._id,
        email: member.email,
        name: member.name,
        username: member.username,
        role: member.role,
        preferences: member.preferences,
        userId: member.userId
      }, 
      process.env.JWT_SECRET || "hello", 
      { expiresIn: "7d" }
    );

    return res.status(200).json({
      token,
      user: {
        id: member._id,
        name: member.name,
        email: member.email,
        username: member.username,
        role: member.role,
        bio: member.bio,
        preferences: member.preferences,
        userId: member.userId,
        recipesPosted: member.recipesPosted,
        challengesCompleted: member.challengesCompleted,
        points: member.points,
        level: member.level,
        avatar: member.avatar
      }
    });
  } catch (error) {
    console.error('Login error:', error);
    res.status(500).json({ message: "Something went wrong", error: error.message });
  }
};

// @desc    Get member profile by userId
// @route   GET /api/community/profile/:userId
// @access  Public
exports.getMemberProfile = async (req, res) => {
  try {
    const member = await Member.findOne({ userId: req.params.userId }).select('-password');
    if (!member) {
      return res.status(404).json({ message: 'Member not found' });
    }

    res.json({
      id: member._id,
      name: member.name,
      email: member.email,
      username: member.username,
      role: member.role,
      bio: member.bio,
      preferences: member.preferences,
      userId: member.userId,
      recipesPosted: member.recipesPosted,
      challengesCompleted: member.challengesCompleted,
      points: member.points,
      level: member.level,
      avatar: member.avatar,
      createdAt: member.createdAt
    });
  } catch (error) {
    console.error('Get profile error:', error);
    res.status(500).json({ message: error.message });
  }
};