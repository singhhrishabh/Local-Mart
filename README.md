# 📦 LocalMart — Local se Local

> **Your mohalla, now in your pocket.**  
> Hyperlocal commerce connecting shops, street food stalls, home services, and package carriers — all within 2–4km. Built for real local markets, not just cities.

---

 For Live Demo (https://localmart-lucknow.web.app )

---

## 🧭 What is LocalMart?

LocalMart is a hyperlocal marketplace platform that digitizes the local economy of a neighbourhood, town, or rural market — the sabziwala, kirana dukan, chat bhandaar, plumber, and the uncle on a scooter going to the next village.

It operates on a strict **2–4km radius** — so every order, every booking, every package is purely local.

**Core motive: Local se Local.** No corporate middlemen. No dark stores. Just your neighbourhood, organized.

---

## 👥 Who is this for?

| Role | Who | What they do |
|---|---|---|
| 🏪 **Vendor** | Sabziwala, kirana store, saree shop | Lists products, goes live, accepts orders |
| 🍽️ **Food Stall** | Chaat bhandaar, kachori corner, bakery | Lists dishes, goes live, accepts food orders |
| 🔧 **Service Provider** | Plumber, electrician, AC technician, maid, dry cleaner | Lists services, accepts or declines bookings |
| 🛒 **Customer** | Anyone nearby | Browses, orders food/goods, books services |
| 📦 **Package Carrier** | Anyone — student, housewife, shopkeeper, traveller | Picks up packages on their existing route and earns a delivery fee |

---

## ✨ Key Features

### For Vendors & Food Stalls
- **Live Toggle** — Go visible to customers with one tap. Turn it off when closing shop.
- **Opens At timer** — Set your opening time when offline. Customers see *"Opens in 1h 30m"* on your card.
- **Inventory management** — Add items with emoji, price, unit. Mark out of stock, restock, delete.
- **Incoming Orders panel** — Accept or reject orders. Accepted orders enter the public Carrier pool.
- **"I will deliver" shortcut** — A vendor can natively bypass the carrier pool and mark an order to be delivered by themselves, instantly switching them into Active Carrier tracking mode.
- **Profile editor** — Update shop name, address, category, phone.

### For Service Providers
- **Availability toggle** — Same as vendors, but shows "Available / Unavailable."
- **Two booking types** — Customers can Book Now (15-min arrival) or Schedule (pick date + time slot).
- **Accept or Decline** — Accept bookings OR decline with a written reason sent back to the customer.
- **Unregistered provider requests** — If a customer describes an issue and no registered provider exists for it, the request is broadcast to all nearby relevant providers.

### For Customers
- **Live map** — Interactive LeafletJS GPS map showing open shops, food stalls, and active carriers nearby.
- **"Opens in X min" cards** — Closed shops show when they'll reopen, so you can plan.
- **Section tabs** — Browse All / Shops / Food / Services separately.
- **Cart + Checkout** — Add from any one shop, checkout with address and phone.
- **My Orders** — Full order history with live tracking when a carrier picks up your package.

### For Package Carriers (Universal 'Earn & Deliver' Mode)
- **Not a job — a route.** Anyone already going from Point A to Point B can use the Universal Carrier Mode to pick up packages along their natural route.
- **On Duty toggle** — Mark yourself available when you're about to head out.
- **Route declaration** — Tell the app where you're going (e.g. Aminabad → Hazratganj). Any pending orders within your path automatically get offered to you.
- **Accept orders** — See matched available packages, accept what fits your route.
- **Pick up + Deliver** — Mark picked up, deliver to customer, mark delivered.
- **Live tracking** — While carrying, the map actively guides you and plots a line to your destination.
- **Earnings** — Platform pays out directly to your Earnings Wallet based on distance geometries upon marking delivery.

---

## 🏗️ Tech Stack

| Layer | Technology |
|---|---|
| Frontend | Vanilla HTML5 + CSS3 + Modular JS (ES6+) |
| Backend | Real-time Firebase (Cloud Firestore & Auth) |
| Maps | LeafletJS + OpenStreetMap Tiles |
| Fonts | Google Fonts — Syne (headings) + DM Sans (body) |
| Hosting | Firebase Hosting |

---

## 🗂️ Project Structure

The codebase has been refactored into a scalable, production-ready modular architecture:
```
public/
  ├── index.html            ← Main single-page application entry
  ├── css/
  │   ├── variables.css     ← Theme tokens & colors
  │   ├── layout.css        ← Grids & Containers
  │   ├── components.css    ← UI components (buttons, cards)
  │   └── auth.css          ← Login modal styles
  └── js/
      ├── firebase-config.js← Database hooks
      ├── data.js           ← Realtime state sync & queries
      ├── auth.js           ← Signup/Login and Demo bootstrapper
      ├── map.js            ← Leaflet interactive map engine
      ├── vendor.js         ← Shop and Inventory logic
      ├── customer.js       ← Cart and Browsing logic
      ├── carrier.js        ← Route matching & earnings logic
      ├── app.js            ← Root UI routing
      └── utils.js          ← Helper formatting
firebase.json               ← Deployment configuration
```

---

## 🚀 How to Run Locally

You don't need a Node backend to run this. Simply serve the `public/` folder over any local HTTP server:

```bash
# Using npx serve
npx serve public/

# OR using Python
cd public && python3 -m http.server 8000
```
Navigate to `http://localhost:8000` or `http://localhost:3000` to interact with the platform natively. All actions will ping the live Cloud Firestore database.

---

## 🔑 Demo Accounts

For testing the live Firestore environment, use the preset buttons on the Login screen, or manually test the following real accounts:

**(Format: `[role].[category]@mail.com` password: `[category]123`)**

### 🏪 Vendors & Food Stalls
- `vendor.vegetable@mail.com` | `vegetable123`
- `vendor.kirana@mail.com` | `kirana123`
- `food.chaat@mail.com` | `chaat123`
- `food.bakery@mail.com` | `bakery123`

### 📦 Universal Carriers
Any user can switch to carrier mode, but dedicated accounts include:
- `carrier1@mail.com` | `carrier123`
- `carrier2@mail.com` | `carrier123`

### 🛒 Customers
- `customer@mail.com` | `customer123`

---

## 🔮 Roadmap Update (Phase 3 Complete)

- [x] Integrate Real-time Backend Syncing (Firebase)
- [x] Replace static SVGs with Interactive GPS Mapping (Leaflet)
- [x] Modularize Codebase 
- [x] Build Route-Declaration matching for Carriers
- [ ] SMS/WhatsApp order notifications
- [ ] UPI payment integration (Razorpay / PhonePe)
- [ ] Multi-language support (Hindi, Tamil, Bengali...)

---

## 📜 License

MIT — Free to use, modify, and distribute. Attribution appreciated.

---

## 👤 Author

Built by **Rishabh** — B.E. ECE, BITS Pilani Dubai Campus  
Project developed as part of independent startup showcase for Y-Combinator / Startup School (April 2026).

---

*"The kirana store on your street deserves the same digital reach as Amazon. LocalMart is how we get there."*
