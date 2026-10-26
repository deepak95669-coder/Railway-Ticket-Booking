const express = require('express');
const router = express.Router();
const { ensureAuth } = require('../middleware/auth');
const Booking = require('../models/Booking');
const User = require('../models/User');

// GET /dashboard
router.get('/', ensureAuth, async (req, res) => {
  try {
    const user = await User.findById(req.session.userId);
    const bookings = await Booking.find({ user: req.session.userId })
      .populate('train')
      .sort({ bookedAt: -1 })
      .limit(5);

    const totalBookings = await Booking.countDocuments({ user: req.session.userId });
    const upcoming = await Booking.countDocuments({
      user: req.session.userId,
      bookingStatus: 'Confirmed',
      journeyDate: { $gte: new Date() }
    });
    const completed = await Booking.countDocuments({
      user: req.session.userId,
      journeyDate: { $lt: new Date() }
    });
    const cancelled = await Booking.countDocuments({
      user: req.session.userId,
      bookingStatus: 'Cancelled'
    });

    // Get next upcoming journey
    const nextJourney = await Booking.findOne({
      user: req.session.userId,
      bookingStatus: 'Confirmed',
      journeyDate: { $gte: new Date() }
    }).populate('train').sort({ journeyDate: 1 });

    res.render('dashboard', {
      title: 'Dashboard – RailEase',
      user,
      bookings,
      stats: { totalBookings, upcoming, completed, cancelled },
      nextJourney,
      error: req.flash('error'),
      success: req.flash('success'),
      activePage: 'dashboard'
    });
  } catch (err) {
    console.error(err);
    req.flash('error', 'Error loading dashboard.');
    res.redirect('/auth/login');
  }
});

module.exports = router;
