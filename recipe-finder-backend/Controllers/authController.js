const jwt = require('jsonwebtoken');
const User = require('../Models/user');
const bcrypt = require('bcrypt');

const JWT_SECRET = process.env.JWT_SECRET || 'hello'; // Use env variable in production
const JWT_EXPIRES_IN = '30m';

const generateToken = (email) => {
    return jwt.sign({ email }, JWT_SECRET, { expiresIn: JWT_EXPIRES_IN });
};

exports.registerUser = async (req, res) => {
    const { name, email, password } = req.body;

    try {
        if (!name || !email || !password) {
            return res.status(400).json({ message: 'All fields are required' });
        }

        const existingUser = await User.findOne({ email });
        if (existingUser) {
            return res.status(409).json({ message: 'User already exists' });
        }

        const hashedPassword = await bcrypt.hash(password, 10);

        const newUser = new User({ name, email, password: hashedPassword });
        const savedUser = await newUser.save();

        const token = generateToken(savedUser.email);

        return res.status(201).json({
            _id: savedUser._id,
            name: savedUser.name,
            email: savedUser.email,
            token
        });
    } catch (error) {
        console.error('Register Error:', error);
        return res.status(500).json({ message: 'Server error', error: error.message });
    }
};

exports.loginUser = async (req, res) => {
    const { email, password } = req.body;

    try {
        if (!email || !password) {
            return res.status(400).json({ message: 'All fields are required' });
        }

        const user = await User.findOne({ email });
        if (!user) {
            return res.status(404).json({ message: 'User does not exist' });
        }

        const isPasswordValid = await bcrypt.compare(password, user.password);
        if (!isPasswordValid) {
            return res.status(401).json({ message: 'Email or password is incorrect' });
        }

        const token = generateToken(user.email);

        return res.status(200).json({
            _id: user._id,
            name: user.name,
            email: user.email,
            token
        });
    } catch (error) {
        console.error('Login Error:', error);
        return res.status(500).json({ message: 'Something went wrong', error: error.message });
    }
};
