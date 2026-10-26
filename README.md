# 🚂 RailEase – Railway Reservation System
> **OOASE Project** | Built with Node.js, Express, MongoDB & EJS

RailEase is a full-featured railway reservation web application that enables users to search train schedules, check seat availability across classes, book tickets, manage reservations, and update user profiles.

---

## ⚡ Quick Start: Terminal Commands

> **Important Note:** The application source code is located in the `railease/` subfolder.

### Recommended Method (From `railease/` directory)

Open your terminal in the project root (`d:\OOASE Project`) and run:

```bash
# 1. Navigate into the application directory
cd railease

# 2. Install dependencies (if not already installed)
npm install

# 3. Seed initial train data into MongoDB
npm run seed

# 4. Start the development server (auto-reloads on file changes)
npm run dev
```

> Or to run in production mode:
> ```bash
> npm start
> ```

---

### Alternative Method (From Project Root)

You can also run commands directly from `d:\OOASE Project`:

```bash
# Start development server
npm run dev

# Or start standard server
npm start

# Seed the database
npm run seed
```

Once started, open your web browser and visit:
👉 **[http://localhost:3000](http://localhost:3000)**

---

## 📋 Prerequisites

Before running the application, make sure you have installed:

1. **[Node.js](https://nodejs.org/)** (v16.x or higher)
2. **[MongoDB](https://www.mongodb.com/try/download/community)** running locally on port `27017` (or a MongoDB Atlas connection URI)
   - *Windows command to check MongoDB service:*
     ```powershell
     net start MongoDB
     ```

---

## ⚙️ Environment Configuration

The application reads its environment variables from [`railease/.env`](file:///d:/OOASE%20Project/railease/.env):

```env
MONGO_URI=mongodb://localhost:27017/railease
SESSION_SECRET=railease_super_secret_key_2024
PORT=3000
```

> **Note:** If your MongoDB runs on a different port or on Atlas, update `MONGO_URI` accordingly.

---

## 🗄️ Database Seeding & Sample Test Searches

Run the seed script to populate sample trains, schedules, and seat quotas:

```bash
cd railease
npm run seed
```

### Station Pairs Available for Testing:

| From Station | Code | To Station | Code | Available Classes |
| :--- | :---: | :--- | :---: | :--- |
| **New Delhi** | `NDLS` | **Mumbai Central** | `BCT` | 1A, 2A, 3A, CC, EC |
| **Chennai Central** | `MAS` | **KSR Bengaluru** | `SBC` | CC, EC |
| **Howrah** | `HWH` | **New Delhi** | `NDLS` | 1A, 2A, 3A, SL |
| **Howrah** | `HWH` | **Mumbai Central** | `MMCT` | 1A, 2A, 3A, SL |
| **New Delhi** | `NDLS` | **Agartala** | `AGTL` | 2A, 3A, SL |

---

## 📂 Project Directory Structure

```text
OOASE Project/
├── package.json              # Root script runner for convenience
├── README.md                 # Project documentation & run guide
└── railease/                 # Main application directory
    ├── .env                  # Environment configuration
    ├── package.json          # Node dependencies & npm scripts
    ├── server.js             # Express app entry point
    ├── seed.js               # Database seeder script
    ├── config/
    │   └── db.js             # Mongoose MongoDB connection
    ├── models/
    │   ├── User.js           # User schema (auth & profile)
    │   ├── Train.js          # Train details & seat inventory
    │   └── Booking.js        # Ticket booking & PNR tracking
    ├── routes/
    │   ├── auth.js           # Login, register, logout routes
    │   ├── dashboard.js      # User dashboard
    │   ├── trains.js         # Search & train schedule routes
    │   ├── bookings.js       # Ticket booking & cancellation routes
    │   └── profile.js        # Profile management routes
    ├── middleware/
    │   └── auth.js           # Authentication guard middleware
    ├── views/                # EJS dynamic UI templates
    └── public/               # Static assets (CSS, JS, images)
```

---

## 🛠️ Troubleshooting Common Issues

### 1. `npm error enoent Could not read package.json`
- **Cause:** You ran `npm start` in the parent directory before entering the `railease` folder.
- **Fix:** Run `cd railease` first, then run `npm start` or `npm run dev`.

### 2. `MongoDB Connection Error`
- **Cause:** MongoDB service is not running on your machine.
- **Fix:** Start MongoDB locally:
  - Open PowerShell as Administrator and run `net start MongoDB`
  - Or launch MongoDB Compass and connect to `mongodb://localhost:27017`

### 3. `Port 3000 is already in use`
- **Cause:** Another process is listening on port 3000.
- **Fix:** Update `PORT=3001` in `railease/.env`, or terminate the process using port 3000.
