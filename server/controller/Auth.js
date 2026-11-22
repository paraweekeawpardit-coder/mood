require('dotenv').config();
const User = require('../Module/Auth');
const bcrypt = require('bcryptjs');
const jwt = require('jsonwebtoken');

exports.Regis = async (req, res) => {
  try {
    const { name, contact, password } = req.body;

    if (!name || !contact || !password) {
      return res.status(400).json({ error: 'Please enter all information' });
    }

    const haveUser = await User.findOne({ contact });
    if (haveUser) {
      return res.status(400).json({ message: 'Account already exists. Please log in' });
    }

    const newUser = new User({
      name,
      contact,
      password
    });

    await newUser.save();
    return res.status(201).json({ message: 'Registered successfully ' });
  } catch (err) {
    console.log(err);
    res.status(500).json({ error: 'Server Error' });
  }
};

exports.Login = async (req, res) => {
  try {
    const { name, password } = req.body;

    if (!name || !password) {
      return res.status(400).json({ error: 'Please enter name and password' });
    }

    const user = await User.findOne({ name }).select('+password');
    if (!user) {
      return res.status(400).json({ error: 'User not found' });
    }

    const isPasswordValid = await bcrypt.compare(password, user.password);
    if (!isPasswordValid) {
      console.log('wrong password');
      return res.status(400).json({ error: 'Wrong password' });
    }

    const payload = { id: user.id, name: user.name };
    const token = jwt.sign(payload, process.env.JWT_SECRET, { expiresIn: '24h' });

    return res.status(200).json({
      message: 'Login successful',
      token,
      id: user._id,
      name: user.name
    });
  } catch (err) {
    console.log(err);
    res.status(500).json({ error: 'Server Error' });
  }
};