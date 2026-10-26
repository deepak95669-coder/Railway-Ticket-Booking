const mongoose = require('mongoose');

const BookingSchema = new mongoose.Schema({
  pnrNumber: {
    type: String,
    unique: true,
    required: true
  },
  user: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'User',
    required: true
  },
  train: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'Train',
    required: true
  },
  journeyDate: { type: Date, required: true },
  travelClass: { type: String, required: true },
  passengers: [{
    name: { type: String, required: true },
    age: { type: Number, required: true },
    gender: { type: String, enum: ['male', 'female', 'other'] },
    seatNumber: { type: String }
  }],
  totalFare: { type: Number, required: true },
  bookingStatus: {
    type: String,
    enum: ['Confirmed', 'Waitlisted', 'Cancelled'],
    default: 'Confirmed'
  },
  paymentStatus: {
    type: String,
    enum: ['Paid', 'Refunded', 'Pending'],
    default: 'Paid'
  },
  bookedAt: { type: Date, default: Date.now }
}, { timestamps: true });

// Generate PNR before saving
BookingSchema.pre('validate', function (next) {
  if (!this.pnrNumber) {
    this.pnrNumber = Math.floor(1000000000 + Math.random() * 9000000000).toString();
  }
  next();
});

module.exports = mongoose.model('Booking', BookingSchema);
