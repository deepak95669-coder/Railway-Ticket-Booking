const express = require('express');
const router = express.Router();
const { ensureAuth } = require('../middleware/auth');
const User = require('../models/User');

// GET /profile
router.get('/', ensureAuth, async (req, res) => {
  try {
    const user = await User.findById(req.session.userId);
    res.render('profile', {
      title: 'My Profile – RailEase',
      user,
      activePage: 'my-profile',
      error: req.flash('error'),
      success: req.flash('success'),
      userName: req.session.userName
    });
  } catch (err) {
    console.error(err);
    req.flash('error', 'Error loading profile.');
    res.redirect('/dashboard');
  }
});

// POST /profile - Update profile
router.post('/', ensureAuth, async (req, res) => {
  try {
    const { fullName, mobile, dateOfBirth, gender } = req.body;
    await User.findByIdAndUpdate(req.session.userId, {
      fullName, mobile, dateOfBirth, gender
    });
    req.session.userName = fullName;
    req.flash('success', 'Profile updated successfully!');
    res.redirect('/profile');
  } catch (err) {
    console.error(err);
    req.flash('error', 'Error updating profile.');
    res.redirect('/profile');
  }
});

module.exports = router;
