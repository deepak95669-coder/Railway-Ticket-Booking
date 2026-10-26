require('dotenv').config();
const mongoose = require('mongoose');
const Train = require('./models/Train');

const trains = [
  {
    trainNumber: '12952',
    trainName: 'Mumbai Rajdhani Express',
    trainType: 'Rajdhani Express',
    fromStation: 'New Delhi',
    fromCode: 'NDLS',
    toStation: 'Mumbai Central',
    toCode: 'BCT',
    departureTime: '16:55',
    arrivalTime: '08:30',
    duration: '15h 35m',
    runningDays: ['Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat', 'Sun'],
    classes: [
      { className: '1A', price: 4820, totalSeats: 20, availableSeats: 14 },
      { className: '2A', price: 2910, totalSeats: 46, availableSeats: 3 },
      { className: '3A', price: 2050, totalSeats: 64, availableSeats: 42 }
    ]
  },
  {
    trainNumber: '22436',
    trainName: 'Tejas Vande Bharat Express',
    trainType: 'Vande Bharat',
    fromStation: 'New Delhi',
    fromCode: 'NDLS',
    toStation: 'Mumbai Central',
    toCode: 'BCT',
    departureTime: '06:00',
    arrivalTime: '19:10',
    duration: '13h 10m',
    runningDays: ['Mon', 'Wed', 'Fri', 'Sun'],
    classes: [
      { className: 'CC', price: 1890, totalSeats: 100, availableSeats: 88 },
      { className: 'EC', price: 3650, totalSeats: 56, availableSeats: 0 }
    ]
  },
  {
    trainNumber: '12007',
    trainName: 'Shatabdi Express',
    trainType: 'Shatabdi Express',
    fromStation: 'Chennai Central',
    fromCode: 'MAS',
    toStation: 'KSR Bengaluru',
    toCode: 'SBC',
    departureTime: '06:00',
    arrivalTime: '11:00',
    duration: '5h 0m',
    runningDays: ['Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat'],
    classes: [
      { className: 'CC', price: 780, totalSeats: 120, availableSeats: 55 },
      { className: 'EC', price: 1480, totalSeats: 56, availableSeats: 20 }
    ]
  },
  {
    trainNumber: '12607',
    trainName: 'Lalbagh Express',
    trainType: 'Superfast Express',
    fromStation: 'Chennai Central',
    fromCode: 'MAS',
    toStation: 'KSR Bengaluru',
    toCode: 'SBC',
    departureTime: '06:15',
    arrivalTime: '11:40',
    duration: '5h 25m',
    runningDays: ['Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat', 'Sun'],
    classes: [
      { className: 'CC', price: 480, totalSeats: 120, availableSeats: 40 },
      { className: '2S', price: 200, totalSeats: 200, availableSeats: 80 }
    ]
  },
  {
    trainNumber: '12301',
    trainName: 'Howrah Rajdhani Express',
    trainType: 'Rajdhani Express',
    fromStation: 'Howrah',
    fromCode: 'HWH',
    toStation: 'New Delhi',
    toCode: 'NDLS',
    departureTime: '13:55',
    arrivalTime: '10:00',
    duration: '20h 5m',
    runningDays: ['Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat', 'Sun'],
    classes: [
      { className: '1A', price: 4250, totalSeats: 20, availableSeats: 8 },
      { className: '2A', price: 2560, totalSeats: 46, availableSeats: 22 },
      { className: '3A', price: 1750, totalSeats: 64, availableSeats: 50 }
    ]
  },
  {
    trainNumber: '22221',
    trainName: 'Rajdhani Express (Mumbai–Howrah)',
    trainType: 'Rajdhani Express',
    fromStation: 'Mumbai CSMT',
    fromCode: 'MMCT',
    toStation: 'Howrah',
    toCode: 'HWH',
    departureTime: '14:00',
    arrivalTime: '22:30',
    duration: '32h 30m',
    runningDays: ['Mon', 'Wed', 'Fri'],
    classes: [
      { className: '1A', price: 5200, totalSeats: 18, availableSeats: 5 },
      { className: '2A', price: 3100, totalSeats: 46, availableSeats: 18 },
      { className: '3A', price: 2100, totalSeats: 80, availableSeats: 60 },
      { className: 'SL', price: 750, totalSeats: 200, availableSeats: 120 }
    ]
  },
  {
    trainNumber: '12569',
    trainName: 'Jnaneshwari Super Deluxe Express',
    trainType: 'Superfast Express',
    fromStation: 'Howrah',
    fromCode: 'HWH',
    toStation: 'Mumbai CSMT',
    toCode: 'MMCT',
    departureTime: '22:45',
    arrivalTime: '07:10',
    duration: '32h 25m',
    runningDays: ['Tue', 'Thu', 'Sat', 'Sun'],
    classes: [
      { className: '2A', price: 2700, totalSeats: 46, availableSeats: 30 },
      { className: '3A', price: 1800, totalSeats: 80, availableSeats: 45 },
      { className: 'SL', price: 680, totalSeats: 200, availableSeats: 150 }
    ]
  },
  {
    trainNumber: '15484',
    trainName: 'Mahananda Express',
    trainType: 'Express',
    fromStation: 'New Delhi',
    fromCode: 'NDLS',
    toStation: 'Agartala',
    toCode: 'AGTL',
    departureTime: '20:30',
    arrivalTime: '06:00',
    duration: '33h 30m',
    runningDays: ['Mon', 'Thu'],
    classes: [
      { className: '3A', price: 1650, totalSeats: 64, availableSeats: 20 },
      { className: 'SL', price: 590, totalSeats: 200, availableSeats: 80 }
    ]
  }
];

const seedDB = async () => {
  try {
    await mongoose.connect(process.env.MONGO_URI);
    console.log('✅ Connected to MongoDB');

    await Train.deleteMany({});
    console.log('🗑️  Cleared existing trains');

    await Train.insertMany(trains);
    console.log(`🚂 Seeded ${trains.length} trains successfully!`);

    console.log('\nTrain codes to test search:');
    console.log('  NDLS → BCT  (Delhi to Mumbai)');
    console.log('  MAS  → SBC  (Chennai to Bengaluru)');
    console.log('  HWH  → NDLS (Howrah to Delhi)');
    console.log('  HWH  → MMCT (Howrah to Mumbai)');
    console.log('  NDLS → AGTL (Delhi to Agartala)\n');

    await mongoose.disconnect();
    process.exit(0);
  } catch (err) {
    console.error('❌ Seed error:', err);
    process.exit(1);
  }
};

seedDB();
