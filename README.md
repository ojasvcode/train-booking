# 🚆 RailWay — Train Booking App

A fully functional **Indian Railway ticket booking web app** built with **Vanilla JavaScript** — featuring station search with autocomplete, train results with class/seat selection, passenger details, payment flow, e-ticket generation with QR code, and booking history.

---

## ✨ Features

- 🔍 **Station Autocomplete** — Search from a database of Indian railway stations
- ⇄ **Swap Stations** — Instantly swap source and destination
- 🚂 **Train Search Results** — Dynamic train list with departure/arrival, duration, distance, class availability
- 🎫 **Class Selection** — 1A, 2A, 3A, SL, CC, EC, 2S with seat availability and pricing
- 💺 **Interactive Seat Map** — Visual seat selection grid with booked/available/selected states
- 👥 **Passenger Details** — Name, age, gender for each passenger
- 💳 **Payment Flow** — UPI / Card / Net Banking / Wallet selection with fare breakdown (GST + service fee)
- 🎟️ **E-Ticket with QR Code** — Auto-generated PNR, boarding details, and visual QR code
- 📋 **My Bookings** — View all past bookings (persisted in localStorage)
- ⏳ **Loading Animations** — "Searching trains..." and "Processing Payment..." overlays
- 📱 **Responsive Design** — Works on desktop and mobile

---

## 🗂️ Project Structure

```
train-booking/
├── index.html              # App shell
├── src/
│   ├── main.js             # Full SPA — all pages, routing, events, rendering
│   ├── style.css           # All styles (dark theme, glassmorphism)
│   └── data/
│       ├── stations.js     # Indian station database + search function
│       └── trains.js       # Train generator, seat generator, class names & pricing
└── package.json
```

---

## 🛠️ Tech Stack

| Technology | Usage |
|---|---|
| Vanilla JavaScript (ES Modules) | SPA logic, rendering, state management |
| HTML5 Canvas | QR code generation |
| CSS3 | Dark glassmorphism theme, animations |
| localStorage | Booking persistence |
| Vite | Dev server & bundler |

---

## 🚀 Getting Started

### Prerequisites
- [Node.js](https://nodejs.org/) v16+

### Installation & Run

```bash
git clone https://github.com/ojasvcode/train-booking.git
cd train-booking
npm install
npm run dev
```

Open **http://localhost:5173** in your browser.

---

## 🎟️ Booking Flow

```
Home (Search) → Train Results → Seat Selection → Passenger Details → Payment → E-Ticket
```

1. **Search** — Enter from/to station, date, passengers, class
2. **Results** — Browse trains, filter by class, check availability
3. **Seats** — Pick seats from the visual seat map
4. **Passengers** — Enter name, age, gender for each traveller
5. **Payment** — Review fare breakdown, choose payment method
6. **E-Ticket** — Receive your PNR and QR code ticket

---

## 💺 Train Classes Supported

| Code | Class |
|---|---|
| 1A | First AC |
| 2A | Second AC |
| 3A | Third AC |
| SL | Sleeper |
| CC | Chair Car |
| EC | Executive Chair Car |
| 2S | Second Sitting |

---

## 📄 License

This project is for educational purposes only and is not affiliated with Indian Railways or IRCTC.

---

<div align="center">Made with ❤️ by <a href="https://github.com/ojasvcode">ojasvcode</a></div>
