const express = require('express');
const router = express.Router();
const { ensureAuth } = require('../middleware/auth');
const Booking = require('../models/Booking');
const Train = require('../models/Train');

// GET /bookings - My Bookings
router.get('/', ensureAuth, async (req, res) => {
  try {
    const bookings = await Booking.find({ user: req.session.userId })
      .populate('train')
      .sort({ bookedAt: -1 });

    res.render('bookings/index', {
      title: 'My Bookings – RailEase',
      bookings,
      activePage: 'my-bookings',
      error: req.flash('error'),
      success: req.flash('success'),
      userName: req.session.userName
    });
  } catch (err) {
    console.error(err);
    req.flash('error', 'Error loading bookings.');
    res.redirect('/dashboard');
  }
});

// GET /bookings/new - Redirect to search trains
router.get('/new', ensureAuth, (req, res) => {
  res.redirect('/trains/search');
});

// GET /bookings/new/:trainId - Book ticket form
router.get('/new/:trainId', ensureAuth, async (req, res) => {
  try {
    const train = await Train.findById(req.params.trainId);
    if (!train) {
      req.flash('error', 'Train not found.');
      return res.redirect('/trains/search');
    }
    res.render('bookings/new', {
      title: 'Book Ticket – RailEase',
      train,
      selectedClass: req.query.class || '',
      journeyDate: req.query.date || '',
      activePage: 'book-tickets',
      error: req.flash('error'),
      success: req.flash('success'),
      userName: req.session.userName
    });
  } catch (err) {
    console.error(err);
    req.flash('error', 'Error loading booking form.');
    res.redirect('/trains/search');
  }
});

// POST /bookings - Create booking
router.post('/', ensureAuth, async (req, res) => {
  try {
    const { trainId, journeyDate, travelClass, passengerNames, passengerAges, passengerGenders } = req.body;

    const train = await Train.findById(trainId);
    if (!train) {
      req.flash('error', 'Train not found.');
      return res.redirect('/trains/search');
    }

    // Build passengers array
    const names = Array.isArray(passengerNames) ? passengerNames : [passengerNames];
    const ages = Array.isArray(passengerAges) ? passengerAges : [passengerAges];
    const genders = Array.isArray(passengerGenders) ? passengerGenders : [passengerGenders];

    const passengers = names.map((name, i) => ({
      name,
      age: parseInt(ages[i]),
      gender: genders[i],
      seatNumber: `B${Math.floor(Math.random() * 10) + 1}-${Math.floor(Math.random() * 72) + 1}`
    }));

    // Calculate fare
    const classInfo = train.classes.find(c => c.className === travelClass);
    const totalFare = classInfo ? classInfo.price * passengers.length : 0;

    // Reduce available seats
    if (classInfo) {
      classInfo.availableSeats = Math.max(0, classInfo.availableSeats - passengers.length);
      await train.save();
    }

    const booking = await Booking.create({
      user: req.session.userId,
      train: trainId,
      journeyDate: new Date(journeyDate),
      travelClass,
      passengers,
      totalFare
    });

    req.flash('success', `Booking confirmed! Your PNR is ${booking.pnrNumber}`);
    res.redirect(`/bookings/${booking._id}`);
  } catch (err) {
    console.error(err);
    req.flash('error', 'Booking failed. Please try again.');
    res.redirect('/trains/search');
  }
});

// GET /bookings/:id - View single booking
router.get('/:id', ensureAuth, async (req, res) => {
  try {
    const booking = await Booking.findOne({
      _id: req.params.id,
      user: req.session.userId
    }).populate('train');

    if (!booking) {
      req.flash('error', 'Booking not found.');
      return res.redirect('/bookings');
    }

    res.render('bookings/detail', {
      title: `Booking ${booking.pnrNumber} – RailEase`,
      booking,
      activePage: 'my-bookings',
      error: req.flash('error'),
      success: req.flash('success'),
      userName: req.session.userName
    });
  } catch (err) {
    console.error(err);
    req.flash('error', 'Error loading booking details.');
    res.redirect('/bookings');
  }
});

// POST /bookings/:id/cancel - Cancel booking
router.post('/:id/cancel', ensureAuth, async (req, res) => {
  try {
    const booking = await Booking.findOne({
      _id: req.params.id,
      user: req.session.userId
    }).populate('train');

    if (!booking) {
      req.flash('error', 'Booking not found.');
      return res.redirect('/bookings');
    }

    if (booking.bookingStatus === 'Cancelled') {
      req.flash('error', 'Booking is already cancelled.');
      return res.redirect(`/bookings/${booking._id}`);
    }

    // Restore seats
    const train = booking.train;
    const classInfo = train.classes.find(c => c.className === booking.travelClass);
    if (classInfo) {
      classInfo.availableSeats += booking.passengers.length;
      await train.save();
    }

    booking.bookingStatus = 'Cancelled';
    booking.paymentStatus = 'Refunded';
    await booking.save();

    req.flash('success', 'Booking cancelled successfully. Refund initiated.');
    res.redirect('/bookings');
  } catch (err) {
    console.error(err);
    req.flash('error', 'Error cancelling booking.');
    res.redirect('/bookings');
  }
});

// GET /bookings/pnr/check - PNR Status page
router.get('/pnr/check', ensureAuth, async (req, res) => {
  try {
    let booking = null;
    const { pnr } = req.query;

    if (pnr) {
      booking = await Booking.findOne({ pnrNumber: pnr }).populate('train').populate('user', 'fullName email');
    }

    res.render('bookings/pnr', {
      title: 'PNR Status – RailEase',
      booking,
      pnr: pnr || '',
      activePage: 'pnr-status',
      error: req.flash('error'),
      success: req.flash('success'),
      userName: req.session.userName
    });
  } catch (err) {
    console.error(err);
    req.flash('error', 'Error checking PNR.');
    res.redirect('/dashboard');
  }
});

module.exports = router;
