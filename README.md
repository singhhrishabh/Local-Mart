# 📦 LocalMart — Local se Local | प्रतापगढ़ & जौनपुर

> **Your mohalla, now in your pocket.**  
> Hyperlocal, offline-first marketplace connecting shops, street food stalls, home services, and package carriers — all within 2–4km. Built for Pratapgarh & Jaunpur.

---

## 🌐 Live Local Server

```bash
http://localhost:8080
```

> The app runs entirely from a static file server. No Node.js backend needed.

---

## 🧭 What is LocalMart?

LocalMart is a **lightweight (<200KB), offline-first PWA** that digitizes the local economy of Pratapgarh & Jaunpur — the sabziwala, kirana dukan, chaat bhandaar, plumber, and the uncle on a scooter going to the next village.

It operates on a strict **2–4km radius** — every order, every booking, every package is purely local.

**Core motive: Local se Local.** No corporate middlemen. No dark stores. Just your neighbourhood, organized.

### Key Constraints
- 🎯 **Build size: ~196KB** (strict <200KB budget)
- 💵 **Cash on Delivery only** (no UPI/QR — designed for rural trust model)
- 📱 **Offline-first** — works without internet, syncs when online
- 🌐 **Hindi default** — full bilingual support (Hindi/English)

---

## 🚀 How to Run Locally

No build step, no npm install, no Node backend. Just serve `public/`:

```bash
# Option 1: Python (recommended)
cd public && python3 -m http.server 8080

# Option 2: npx serve
npx serve public/ -p 8080

# Option 3: PHP
cd public && php -S localhost:8080
```

Open **http://localhost:8080** in your browser.

> **Note:** On first load, the app seeds demo data into Cloud Firestore automatically. Ensure you have internet connectivity for the initial setup.

---

## 🔑 Login Credentials

### 🛡️ Admin (God-Mode)
| Email | Password |
|---|---|
| `admin@localmart.in` | `admin123` |

Full CRUD access to all vendors, customers, carriers, orders, and audit log.

### 🏪 Vendors & Food Stalls
| Email | Password | Type |
|---|---|---|
| `gupta.dairy@mail.com` | `dairy123` | Dairy Shop |
| `sharma.bakery@mail.com` | `bakery123` | Bakery |
| `sharma.veg@mail.com` | `veg123` | Vegetables |
| `meena.saree@mail.com` | `saree123` | Clothing |
| `raju.kachori@mail.com` | `kachori123` | Chaat/Food |
| `royal.chaat@mail.com` | `chaat123` | Chaat/Food |
| `pappu.kirana@mail.com` | `kirana123` | Kirana Store |

### 📦 Carriers
| Email | Password |
|---|---|
| `rider1@mail.com` | `rider123` |
| `rider2@mail.com` | `rider123` |

### 🛒 Customers
| Email | Password |
|---|---|
| `customer@mail.com` | `customer123` |
| `customer2@mail.com` | `customer123` |

### 📱 Phone + OTP Login
Toggle to "Phone + OTP" mode on the login screen. Demo OTP: **`123456`**

---

## 👥 User Roles

| Role | Who | What they do |
|---|---|---|
| 🛡️ **Admin** | Super Admin | Full CRUD, audit log, force-deliver, system health |
| 🏪 **Vendor** | Sabziwala, kirana, saree shop | Lists products, goes live, accepts/declines orders |
| 🍽️ **Food Stall** | Chaat bhandaar, kachori, bakery | Lists dishes, goes live, accepts food orders |
| 🔧 **Service Provider** | Plumber, electrician, AC mechanic | Lists services, accepts/declines bookings |
| 🛒 **Customer** | Anyone nearby | Browses, orders, books services, tracks delivery |
| 📦 **Package Carrier** | Student, housewife, traveller | Picks packages on their route, earns delivery fee |

---

## ✨ Features

### 🔄 Offline-First Engine
- **IndexedDB** queues orders when offline → auto-syncs on reconnection
- **Service Worker** caches all assets for instant load without internet
- **Background Sync** pushes pending orders when connectivity restores
- **Latency watchdog** detects slow connections and offers SMS fallback

### 🛡️ Admin God-Mode Dashboard
- Real-time overview: vendors, customers, carriers, orders, live count
- **Full CRUD** on all entities (create, edit, delete)
- **Order lifecycle tracking**: Placed → Notified → Accepted → Carrying → Delivered
- **Force-deliver** capability for stuck orders
- **Audit log** with timestamped entries of all system activity
- **System health**: Firebase status, offline DB, online/offline, region

### 🌐 Bilingual (Hindi / English)
- 80+ translatable strings via `data-i18n` attributes
- **Language toggle on every screen** including the auth/login page
- Hindi is the default language
- One-click switch: `🌐 EN / हिं`

### 📱 Adaptive UI
- **Mobile**: Bottom navigation bar, 56px touch targets, card-based layout
- **Desktop**: Sidebar for admin/vendor, top nav for customer, grid layout
- Responsive breakpoints at 768px and 1024px

### 🏪 Vendor Features
- Live/offline toggle with "Opens in Xh Ym" countdown
- Inventory CRUD with emoji, price, unit, stock status
- **Image upload** with client-side Canvas compression (WebP, 300px, 60% quality)
- **Smart decline**: reason required, customer gets SMS with alternative shop suggestion
- **Safety toggle** for home service providers
- Accept/reject orders from dashboard

### 📦 Carrier Wizard
- **Step 1**: "Where are you heading?" — enter From/To
- **Step 2**: Matching packages auto-shown based on route
- SMS notifications on accept and deliver
- Earnings tracking per delivery (₹40–₹80)

### 🛒 Customer Experience
- **Live LeafletJS map** with shop markers and "YOU" dot
- Search with **Hindi voice input** (Web Speech API, `hi-IN`)
- Category tabs: All / Shops / Food / Services
- Cart + COD-only checkout with unique order IDs (`LM-<timestamp>`)
- Order history with status tracking
- "Opens in Xh Ym" cards for closed shops

### 📡 Communication Layer
- **WhatsApp** deep links (`wa.me/...`) for vendor-customer coordination
- **SMS** triggers (`sms:...`) for order notifications and decline reasons
- Fallback to SMS when internet is slow (latency watchdog)

### 🔐 Dual Login
- **Email + Password** — standard login for all roles
- **Phone + OTP** — simulated for demo (production requires Firebase Blaze plan)
- **Sign Out** visible on every screen

---

## 🏗️ Tech Stack

| Layer | Technology |
|---|---|
| Frontend | Vanilla HTML5 + CSS3 + Modular JS (ES6+) |
| Backend | Real-time Firebase (Cloud Firestore & Auth) |
| Offline | IndexedDB + Service Worker + Background Sync |
| Maps | LeafletJS + OpenStreetMap + CARTO Tiles |
| Fonts | Google Fonts — Syne (headings) + DM Sans (body) |
| PWA | manifest.json + sw.js (cache-first strategy) |
| Hosting | Any static file server (Python, npx serve, etc.) |
| Region | Pratapgarh (25.8958°N, 81.9761°E) & Jaunpur |

---

## 🗂️ Project Structure

```
public/
  ├── index.html              ← Single-page app entry (all screens)
  ├── manifest.json           ← PWA manifest (installable)
  ├── sw.js                   ← Service Worker (offline cache)
  ├── css/
  │   ├── variables.css       ← Theme tokens, colors, animations
  │   ├── auth.css            ← Login/signup modal styles
  │   ├── layout.css          ← Grids, sidebar, bottom nav
  │   ├── components.css      ← Buttons, cards, modals, toasts
  │   └── customer.css        ← Customer-specific UI
  └── js/
      ├── firebase-config.js  ← Firebase project configuration
      ├── data.js             ← Demo data seed + Firestore sync
      ├── auth.js             ← Dual login (email/phone), admin routing
      ├── i18n.js             ← Hindi/English translations (80+ strings)
      ├── offline.js          ← IndexedDB queue + thumbnail cache
      ├── admin.js            ← God-Mode dashboard (CRUD + audit)
      ├── map.js              ← LeafletJS map engine (Pratapgarh coords)
      ├── vendor.js           ← Shop inventory + smart decline
      ├── carrier.js          ← 2-step wizard + route matching
      ├── customer.js         ← Cart, checkout, latency watchdog
      ├── utils.js            ← WhatsApp/SMS, image compression, voice
      └── app.js              ← Root initialization + i18n apply
firebase.json                 ← Firebase Hosting config
firestore.rules               ← Firestore security rules
```

**Total build size: ~196KB** (19 files)

---

## 🔮 Roadmap

- [x] Real-time Firebase backend syncing
- [x] Interactive GPS mapping (LeafletJS)
- [x] Modular codebase architecture
- [x] Route-declaration matching for carriers
- [x] Offline-first with IndexedDB + Service Worker
- [x] PWA installable (manifest.json)
- [x] Admin God-Mode dashboard with audit log
- [x] Hindi/English bilingual support (i18n)
- [x] WhatsApp/SMS communication layer
- [x] COD-only checkout
- [x] Dual login (Email + Phone/OTP)
- [x] Client-side image compression
- [x] Voice search (Hindi)
- [x] Smart vendor decline with alt-shop SMS
- [x] Carrier 2-step wizard
- [x] Adaptive UI (mobile/desktop)
- [ ] Firebase Phone Auth on Blaze plan (production OTP)
- [ ] Production Firestore security rules (role-based)
- [ ] Push notifications (FCM)
- [ ] Multi-region support (beyond Pratapgarh/Jaunpur)

---

## ⚠️ Production Notes

1. **Firebase Phone Auth** requires the Blaze (pay-as-you-go) plan. Currently uses simulated OTP (`123456`).
2. **Firestore rules** are permissive for development. Tighten with role-based access before production deploy.
3. **Service Worker** uses cache-first strategy. Bump the `CACHE` version in `sw.js` when deploying new code.
4. **Admin detection** is email-based (`admin@localmart.in`). For production, use Firebase Custom Claims.

---

## 📜 License

MIT — Free to use, modify, and distribute. Attribution appreciated.

---

## 👤 Author

Built by **Rishabh** — B.E. ECE, BITS Pilani Dubai Campus  
Project developed as part of independent startup showcase for Y-Combinator / Startup School (April 2026).

---

*"The kirana store on your street deserves the same digital reach as Amazon. LocalMart is how we get there — offline-first, Hindi-first, local-first."*
