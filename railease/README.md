# 🚂 RailEase – Railway Reservation System
> **OOASE Project** | Built with Node.js, Express, MongoDB & EJS

RailEase is a full-featured railway reservation web application that enables users to search train schedules, check seat availability across classes, book tickets, manage reservations, and update user profiles.

---

## ⚡ Terminal Running Commands

To run this application, make sure your terminal is inside the `railease` folder:

```bash
# 1. Install dependencies
npm install

# 2. Seed train data into MongoDB
npm run seed

# 3. Start development server (with nodemon auto-reload)
npm run dev
```

> For production mode without nodemon:
> ```bash
> npm start
> ```

Open your browser at:
👉 **[http://localhost:3000](http://localhost:3000)**

---

## 📋 Prerequisites

- **[Node.js](https://nodejs.org/)** (v16.x or higher)
- **[MongoDB](https://www.mongodb.com/)** running locally on port `27017` (or MongoDB Atlas URI)

---

## ⚙️ Environment Configuration (`.env`)

Configuration is stored in `.env`:

```env
MONGO_URI=mongodb://localhost:27017/railease
SESSION_SECRET=railease_super_secret_key_2024
PORT=3000
```

---

## 🗄️ Sample Test Station Searches

After running `npm run seed`, you can test searches using:

- **New Delhi (`NDLS`) → Mumbai Central (`BCT`)**
- **Chennai Central (`MAS`) → KSR Bengaluru (`SBC`)**
- **Howrah (`HWH`) → New Delhi (`NDLS`)**
- **Howrah (`HWH`) → Mumbai Central (`MMCT`)**
- **New Delhi (`NDLS`) → Agartala (`AGTL`)**

---

## 🛠️ Troubleshooting

- **MongoDB Error:** Make sure MongoDB service is running (`net start MongoDB` in Windows terminal).
- **Port Conflict:** Change `PORT=3000` in `.env` if port 3000 is occupied.
