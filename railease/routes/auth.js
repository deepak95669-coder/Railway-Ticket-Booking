const express = require('express');
const router = express.Router();
const User = require('../models/User');
const { ensureGuest } = require('../middleware/auth');

// GET /auth/login
router.get('/login', ensureGuest, (req, res) => {
  res.render('auth/login', {
    title: 'Login – RailEase',
    layout: false,
    error: req.flash('error'),
    success: req.flash('success')
  });
});

// POST /auth/login
router.post('/login', ensureGuest, async (req, res) => {
  try {
    const { email, password } = req.body;
    if (!email || !password) {
      req.flash('error', 'Please provide email and password.');
      return res.redirect('/auth/login');
    }

    const user = await User.findOne({ email: email.toLowerCase() });
    if (!user) {
      req.flash('error', 'Invalid credentials. Please try again.');
      return res.redirect('/auth/login');
    }

    const isMatch = await user.matchPassword(password);
    if (!isMatch) {
      req.flash('error', 'Invalid credentials. Please try again.');
      return res.redirect('/auth/login');
    }

    req.session.userId = user._id;
    req.session.userName = user.fullName;
    req.flash('success', `Welcome back, ${user.fullName}!`);
    res.redirect('/dashboard');
  } catch (err) {
    console.error(err);
    req.flash('error', 'Something went wrong. Please try again.');
    res.redirect('/auth/login');
  }
});

// GET /auth/signup
router.get('/signup', ensureGuest, (req, res) => {
  res.render('auth/signup', {
    title: 'Create Account – RailEase',
    layout: false,
    error: req.flash('error'),
    success: req.flash('success')
  });
});

// POST /auth/signup
router.post('/signup', ensureGuest, async (req, res) => {
  try {
    const { fullName, email, mobile, dateOfBirth, gender, password, confirmPassword } = req.body;

    if (!fullName || !email || !mobile || !password || !confirmPassword) {
      req.flash('error', 'Please fill in all required fields.');
      return res.redirect('/auth/signup');
    }

    if (password !== confirmPassword) {
      req.flash('error', 'Passwords do not match.');
      return res.redirect('/auth/signup');
    }

    if (password.length < 6) {
      req.flash('error', 'Password must be at least 6 characters.');
      return res.redirect('/auth/signup');
    }

    const existingUser = await User.findOne({ email: email.toLowerCase() });
    if (existingUser) {
      req.flash('error', 'An account with this email already exists.');
      return res.redirect('/auth/signup');
    }

    const user = await User.create({ fullName, email, mobile, dateOfBirth, gender, password });

    req.session.userId = user._id;
    req.session.userName = user.fullName;
    req.flash('success', `Welcome to RailEase, ${user.fullName}!`);
    res.redirect('/dashboard');
  } catch (err) {
    console.error(err);
    req.flash('error', 'Registration failed. Please try again.');
    res.redirect('/auth/signup');
  }
});

// GET /auth/logout
router.get('/logout', (req, res) => {
  req.session.destroy(() => {
    res.redirect('/auth/login');
  });
});

module.exports = router;
