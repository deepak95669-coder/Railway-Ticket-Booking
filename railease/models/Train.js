const mongoose = require('mongoose');

const TrainSchema = new mongoose.Schema({
  trainNumber: { type: String, required: true, unique: true },
  trainName: { type: String, required: true },
  trainType: { type: String, enum: ['Rajdhani Express', 'Vande Bharat', 'Shatabdi Express', 'Superfast Express', 'Express', 'Passenger'], required: true },
  fromStation: { type: String, required: true },
  fromCode: { type: String, required: true },
  toStation: { type: String, required: true },
  toCode: { type: String, required: true },
  departureTime: { type: String, required: true },
  arrivalTime: { type: String, required: true },
  duration: { type: String, required: true },
  classes: [{
    className: String,  // e.g., 1A, 2A, 3A, SL, CC, EC
    price: Number,
    totalSeats: Number,
    availableSeats: Number
  }],
  runningDays: [{ type: String }], // Mon, Tue, etc.
  isActive: { type: Boolean, default: true }
}, { timestamps: true });

module.exports = mongoose.model('Train', TrainSchema);
