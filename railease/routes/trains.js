const express = require('express');
const router = express.Router();
const { ensureAuth } = require('../middleware/auth');
const Train = require('../models/Train');

// GET /trains/search - Search trains page
router.get('/search', ensureAuth, async (req, res) => {
  try {
    const { from, to, date, travelClass } = req.query;
    let trains = [];
    let searched = false;

    if (from && to && date) {
      searched = true;
      const query = {
        fromCode: { $regex: from, $options: 'i' },
        toCode: { $regex: to, $options: 'i' },
        isActive: true
      };
      if (travelClass) {
        query['classes.className'] = travelClass;
      }
      trains = await Train.find(query);
    }

    const user = require('../models/User').findById(req.session.userId);

    res.render('trains/search', {
      title: 'Search Trains – RailEase',
      trains,
      searched,
      query: req.query,
      activePage: 'search-trains',
      error: req.flash('error'),
      success: req.flash('success'),
      userName: req.session.userName
    });
  } catch (err) {
    console.error(err);
    req.flash('error', 'Error searching trains.');
    res.redirect('/dashboard');
  }
});

// GET /trains/:id - View train details
router.get('/:id', ensureAuth, async (req, res) => {
  try {
    const train = await Train.findById(req.params.id);
    if (!train) {
      req.flash('error', 'Train not found.');
      return res.redirect('/trains/search');
    }
    res.render('trains/detail', {
      title: `${train.trainName} – RailEase`,
      train,
      activePage: 'search-trains',
      query: req.query,
      error: req.flash('error'),
      success: req.flash('success'),
      userName: req.session.userName
    });
  } catch (err) {
    console.error(err);
    req.flash('error', 'Error loading train details.');
    res.redirect('/trains/search');
  }
});

module.exports = router;
