# 📦 LocalMart — Local se Local

> **Your mohalla, now in your pocket.**  
> Hyperlocal commerce connecting shops, street food stalls, home services, and package carriers — all within 2–4km. Built for real local markets, not just cities.

---

## For Live Demo ( https://singhhrishabh.github.io/Local-Mart/ )

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
- **Incoming Orders panel** — Accept or reject orders. Accepted orders auto-trigger Package Carrier assignment.
- **Profile editor** — Update shop name, address, category, phone.

### For Service Providers
- **Availability toggle** — Same as vendors, but shows "Available / Unavailable."
- **Two booking types** — Customers can Book Now (15-min arrival) or Schedule (pick date + time slot).
- **Accept or Decline** — Accept bookings OR decline with a written reason sent back to the customer.
- **Unregistered provider requests** — If a customer describes an issue and no registered provider exists for it, the request is broadcast to all nearby relevant providers. If still none, LocalMart team reviews and connects manually.

### For Customers
- **Live map** — See open shops, food stalls, and carriers as green/coloured pins. Yellow dots = active carriers.
- **"Opens in X min" cards** — Closed shops show when they'll reopen, so you can plan.
- **Section tabs** — Browse All / Shops / Food / Services separately.
- **Cart + Checkout** — Add from any one shop, checkout with address and phone, choose Cash on Delivery or UPI.
- **My Orders** — Full order history with live tracking when a carrier picks up your package.
- **Service request form** — Can't find a service? Describe your issue and LocalMart routes it to registered providers or handles it manually.

### For Package Carriers (the most unique feature)
- **Not a job — a route.** Anyone already going from Point A to Point B can sign up as a carrier and pick up packages along their natural route.
- **On Duty toggle** — Mark yourself available when you're about to head out.
- **Route declaration** — Tell the app where you're going (e.g. Main Market → Bus Stand). Any pending orders within your path get offered to you.
- **Accept orders** — See available packages, accept what fits your route.
- **Pick up + Deliver** — Mark picked up, deliver to customer, mark delivered.
- **Live tracking** — While carrying, a live dot on the map shows your movement to the customer.
- **Earnings** — ₹40 for small orders, ₹60 for medium, ₹80 for larger. Paid weekly. No target. No boss. Just earn on your route.

---

## 🗂️ Project Structure

```
index.html          ← Single-file web app (HTML + CSS + JS)
README.md                  ← This file
```

All data is stored in **localStorage** (key: `lm4_db`). No server needed — fully runs offline in any browser. This is a prototype/demo build.

---

## 🔑 Demo Accounts

All accounts use the format `role.category@mail.com` with password `category123`.

### 🏪 Vendors
| Name | Email | Password | Status |
|---|---|---|---|
| Sharma Fresh Vegetables | `vendor.vegetable@mail.com` | `vegetable123` | 🟢 Live |
| Gupta Dairy Fresh | `vendor.dairy@mail.com` | `dairy123` | 🟢 Live |
| Pappu Kirana Store | `vendor.kirana@mail.com` | `kirana123` | 🔴 Opens in 1.5h |
| Meena Saree Collection | `vendor.saree@mail.com` | `saree123` | 🔴 Opens in 3h |

### 🍽️ Food Stalls
| Name | Email | Password | Status |
|---|---|---|---|
| Radhelal Chat Bhandaar | `food.chaat@mail.com` | `chaat123` | 🟢 Live |
| Raju Kachori Corner | `food.kachori@mail.com` | `kachori123` | 🔴 Opens in 2h |
| Mohan Bakery & Sweets | `food.bakery@mail.com` | `bakery123` | 🟢 Live |

### 🔧 Service Providers
| Name | Email | Password | Status |
|---|---|---|---|
| Vikram Plumbing Works | `service.plumbing@mail.com` | `plumbing123` | 🟢 Available |
| CleanHome Maid Services | `service.maid@mail.com` | `maid123` | 🟢 Available |
| Ravi CoolTech AC Service | `service.ac@mail.com` | `ac123` | 🟢 Available |
| Bijli Bhai Electrician | `service.electrician@mail.com` | `electrician123` | 🔴 Opens in 1h |
| Shubham Dry Cleaning | `service.dryclean@mail.com` | `dryclean123` | 🔴 Opens in 30m |

### 📦 Package Carriers (Rider 1–8)
| Email | Password |
|---|---|
| `carrier1@mail.com` | `carrier123` |
| `carrier2@mail.com` | `carrier123` |
| `carrier3@mail.com` | `carrier123` |
| `carrier4@mail.com` | `carrier123` |
| `carrier5@mail.com` | `carrier123` |
| `carrier6@mail.com` | `carrier123` |
| `carrier7@mail.com` | `carrier123` |
| `carrier8@mail.com` | `carrier123` |

### 🛒 Customers
| Email | Password |
|---|---|
| `customer@mail.com` | `customer123` |
| `customer2@mail.com` | `customer123` |

---

## 💡 The Package Carrier Concept (Unique Differentiator)

Traditional delivery apps require dedicated delivery boys — people hired, trained, with set shifts and salaries. That model **doesn't work in rural India or small towns.**

LocalMart flips this:

> "I'm Ramesh. I go from Sector 14 to the grain market every morning on my cycle. Why can't I carry Priya's vegetables on the way and earn ₹40?"

**Any local person can be a carrier:**
- A student going to college
- A shopkeeper opening their store
- A housewife going to the vegetable market
- A retired person going for a morning walk
- A labourer going to the worksite
- A farmer going to the mandi

They declare where they're going, see packages on their route, pick them up, drop them off, and earn. **No app knowledge needed beyond toggling On/Off.**

This creates a self-sustaining local delivery mesh that grows organically as more people join — without any logistics overhead.

---

## 🗺️ Order Flow

```
Customer places order
        ↓
Vendor gets notification (🔔 pending badge)
        ↓
Vendor accepts order
        ↓
System finds nearest available Package Carrier
        ↓
Carrier sees the order (or accepts from available list)
        ↓
Carrier marks "Picked Up" → Live tracking begins
        ↓
Animated dot on customer's map shows carrier moving
        ↓
Carrier marks "Delivered" → Carrier earns fee
        ↓
Customer sees ✓ Delivered in My Orders
```

---

## 🔧 Service Flow

```
Customer opens service provider page
        ↓
Option 1: "Book Now" — provider arrives in ~15 min
Option 2: "Schedule" — pick date + time slot
        ↓
Request appears in provider's Bookings tab
        ↓
Provider accepts OR declines with written reason
        ↓
Customer sees status + decline reason in My Orders
```

### Unregistered Service Request
```
Customer doesn't find their service type listed
        ↓
Uses "Describe your issue" form at bottom
        ↓
LocalMart broadcasts to all matching registered providers
        ↓
If none → LocalMart team manually sources within 2 hours
```

---

## 📱 Responsive Design

| Screen | Layout |
|---|---|
| Mobile (< 768px) | Full-screen single column, bottom navigation bar, slide-up modals |
| Tablet (768–1024px) | Sidebar shows, main content adapts |
| Desktop (> 1024px) | Sidebar + map panel + main content + cart side panel |

---

## 🏗️ Tech Stack

| Layer | Technology |
|---|---|
| Frontend | Vanilla HTML5 + CSS3 + JavaScript (ES6+) |
| Fonts | Google Fonts — Syne (headings) + DM Sans (body) |
| Storage | Browser localStorage (key: `lm4_db`) |
| Maps | Inline SVG with dynamic pin rendering |
| Tracking | CSS/JS animated SVG dot |
| Auth | In-memory user store with password matching |
| Framework | None — zero dependencies |

---

## 🚀 How to Run

```bash
# No setup required. Just open the file:
open index.html
# or double-click the file in any file manager
```

Works in Chrome, Firefox, Safari, Edge. No internet required after fonts load.

---

## 🗃️ Data Model (localStorage)

```json
{
  "users": [
    {
      "id": "v1",
      "email": "vendor.vegetable@mail.com",
      "role": "vendor",
      "type": "shop",
      "bizName": "Sharma Fresh Vegetables",
      "category": "shop|🥦 Vegetables",
      "isLive": true,
      "opensAt": "",
      "items": [
        { "id": "i1", "name": "Palak", "price": 20, "unit": "per 250g", "emoji": "🥬", "avail": true }
      ],
      "mapX": 108, "mapY": 72
    }
  ],
  "orders": [
    {
      "id": "#3821",
      "customerId": "c1",
      "vendorId": "v1",
      "carrierId": "r1",
      "status": "picked_up",
      "items": [...],
      "total": 100,
      "address": "B-12, Ashok Nagar",
      "createdAt": 1711234567890
    }
  ],
  "serviceRequests": [
    {
      "id": "req_1711234",
      "customerId": "c1",
      "vendorId": "s1",
      "isNow": true,
      "status": "pending",
      "issue": "Kitchen pipe leaking",
      "address": "B-12, Ashok Nagar"
    }
  ],
  "cart": [],
  "currentUser": "c1"
}
```

---

## 💰 Carrier Earning Structure

| Order Value | Carrier Earns |
|---|---|
| Up to ₹299 | ₹20 per delivery |
| ₹300 – ₹499 | ₹40 per delivery |
| ₹500 and above | ₹60 per delivery |

Earnings are credited weekly via UPI or cash. No minimum deliveries required. No target pressure.

---

## 🔮 Roadmap (Future Features)

- [ ] Real backend (Node.js + PostgreSQL or Firebase)
- [ ] SMS/WhatsApp order notifications
- [ ] Google Maps integration for real routing
- [ ] Carrier route declaration ("I'm going from A to B")
- [ ] UPI payment integration (Razorpay / PhonePe)
- [ ] Ratings & reviews for vendors and carriers
- [ ] Multi-language support (Hindi, Tamil, Bengali...)
- [ ] Vendor analytics dashboard
- [ ] OTP-based auth
- [ ] Native mobile app (React Native / Flutter)
- [ ] Cash collection & digital ledger for carriers
- [ ] Group delivery (one carrier, multiple stops on same route)

---

## 🤝 Contributing

This is a prototype built for the YC Startup School Bengaluru showcase (April 18, 2026). If you want to contribute, extend, or adapt this for your local market:

1. Fork or download `index.html`
2. Open in any browser
3. All logic is in the `<script>` block at the bottom
4. Data layer: replace `localStorage` calls with API calls to your backend

---

## 📜 License

MIT — Free to use, modify, and distribute. Attribution appreciated.

---

## 👤 Author

Built by **Rishabh** — B.E. ECE, BITS Pilani Dubai Campus  
Project developed as part of independent startup exploration, 2026.

---

*"The kirana store on your street deserves the same digital reach as Amazon. LocalMart is how we get there."*
