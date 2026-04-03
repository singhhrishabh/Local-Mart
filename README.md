# 🏪 LocalMart — Unified Marketplace Platform

> A **local-first, offline-capable PWA** for hyperlocal commerce in Pratapgarh & Jaunpur. Vendors, food stalls, and service providers connect with customers through a real-time marketplace with carrier logistics.

[![Firebase](https://img.shields.io/badge/Firebase-FFCA28?style=flat&logo=firebase&logoColor=black)](https://firebase.google.com/)
[![Vanilla JS](https://img.shields.io/badge/Vanilla_JS-F7DF1E?style=flat&logo=javascript&logoColor=black)](https://developer.mozilla.org/en-US/docs/Web/JavaScript)
[![PWA](https://img.shields.io/badge/PWA-5A0FC8?style=flat&logo=pwa&logoColor=white)](https://web.dev/progressive-web-apps/)

---

## 🗂️ Architecture

```
Local-Mart/
├── public/
│   ├── index.html          # Single-page app shell
│   ├── manifest.json       # PWA manifest
│   ├── sw.js               # Service Worker (offline-first)
│   ├── css/
│   │   ├── variables.css   # Design tokens
│   │   ├── auth.css        # Login UI
│   │   ├── layout.css      # Layout grid
│   │   ├── components.css  # Reusable components
│   │   └── customer.css    # Customer-specific styles
│   └── js/
│       ├── firebase-config.js  # Firebase init
│       ├── data.js         # DEMOS, DB, fuzzy search, low-stock, batching
│       ├── auth.js         # Hybrid login (Email + Phone OTP), lockout, RBAC
│       ├── admin.js        # God-Mode admin dashboard
│       ├── vendor.js       # Vendor/food/service dashboard
│       ├── carrier.js      # Carrier delivery management
│       ├── customer.js     # Customer browsing, cart, order timeline
│       ├── map.js          # Leaflet map integration
│       ├── i18n.js         # Hindi/English multilingual
│       ├── offline.js      # IndexedDB offline queue
│       ├── utils.js        # Shared helpers, WhatsApp/SMS triggers
│       └── app.js          # App entry point
└── README.md
```

---

## 🔐 1. User Roles & Test Accounts

### A. Vendors & Food Stalls (7 accounts)
| Email | Password | Shop Type |
|:---|:---|:---|
| `gupta.dairy@mail.com` | `dairy123` | 🧴 Dairy Shop |
| `sharma.bakery@mail.com` | `bakery123` | 🥐 Bakery |
| `sharma.veg@mail.com` | `veg123` | 🥦 Vegetables |
| `meena.saree@mail.com` | `saree123` | 👗 Clothing |
| `raju.kachori@mail.com` | `kachori123` | 🍽️ Chaat/Food |
| `royal.chaat@mail.com` | `chaat123` | 🍽️ Chaat/Food |
| `pappu.kirana@mail.com` | `kirana123` | 🛒 Kirana Store |

### B. Logistics (Carriers)
| Email | Password |
|:---|:---|
| `rider1@mail.com` | `rider123` |
| `rider2@mail.com` | `rider123` |

### C. Customers
| Email | Password |
|:---|:---|
| `customer@mail.com` | `customer123` |
| `customer2@mail.com` | `customer123` |

### D. Admin (God-Mode)
| Email | Password |
|:---|:---|
| `admin@localmart.in` | `admin123` |

---

## 🔒 2. Security & Authentication

### Hybrid Login System
- **Email/Password**: Standard login with Firebase Auth
- **Phone + OTP**: Toggle to phone mode, enter registered number, demo OTP: `123456`

### Account Lockout
- After **5 failed login attempts** → account locked for **5 minutes**
- Warning shown after 3rd attempt: *"2 attempts remaining before lockout"*

### Role-Based Access Control (RBAC)
- `requireRole('vendor')` guard prevents customers from accessing vendor APIs
- Admin has full visibility into all user types

### Biometric Ready
- Architecture supports WebAuthn/biometric prompt integration for mobile sessions

---

## 🎨 3. UX Enhancements

### Real-Time Tracking
- **Leaflet Maps** integration showing vendor/carrier locations
- Live tracking dot when carrier marks "Picked Up"

### Smart Fuzzy Search
- Typo-tolerant search: *"Kachori"* → finds **"Raju Kachori Wala"**
- 70% character match threshold using subsequence matching
- Works across shop names and item names

### Multilingual UI
- Toggle **EN/हिं** on every page (login, dashboards, customer)
- Hindi translations for all UI labels, status messages, FAQs

### Order Status Timeline
Visual progress bar on every order:
```
📦 Placed → 👨‍🍳 Preparing → 🛵 Out for Delivery → ✅ Delivered
```
- Active step highlighted with glow effect
- Declined orders show ❌ status

### Quick Chat
Pre-defined message tags for Riders and Customers:
- 📍 *I have arrived*
- 🚪 *Leave at the gate*
- ⏳ *On my way*
- 📞 *Call me*
- 🔔 *Order ready*

---

## ⚙️ 4. Operational Features

### Low-Stock Alerts
- Automated toast notifications when inventory falls below **5 units**
- Alerts shown on vendor login: *"⚠️ Low stock: 🌶️ Hari Mirch — only 3 left!"*

### Rider Batching Algorithm
- Groups orders from the same vendor when delivery addresses share area keywords
- Reduces delivery trips for orders within ~1km radius

### Admin God-Mode Dashboard
- **Full CRUD**: Add/Edit/Delete any Vendor, Customer, or Carrier
- **Inventory Oversight**: View and manage any vendor's stock
- **Live Status Tracking**: Online/Offline/On Delivery badges
- **Communication Audit Log**: Tracks all WhatsApp/SMS triggers
- **System Health**: Firebase status, total users, region info

### Offline-First Architecture
- **Service Worker** caches all assets for offline access
- **IndexedDB** queues orders placed without internet
- Auto-sync when connection restores via Background Sync API

---

## ✅ 5. QA Validation Checklist

| Test | Expected | Status |
|:---|:---|:---|
| Login all 7 vendor accounts | Each reaches vendor dashboard | ✅ |
| Login 2 rider accounts | Each reaches carrier dashboard | ✅ |
| Login 2 customer accounts | Each reaches customer home | ✅ |
| Admin login | God-Mode dashboard with all users visible | ✅ |
| Phone + OTP (123456) | Authenticates registered phone numbers | ✅ |
| Fuzzy search "Kachori" | Shows Raju Kachori Wala | ✅ |
| Account lockout (5 fails) | Shows lockout message with timer | ✅ |
| Low-stock alerts | Toast on vendor login for items ≤ 5 | ✅ |
| Order timeline | Progress bar on customer order cards | ✅ |
| Admin CRUD | Add/Edit/Delete users from admin panel | ✅ |
| Offline mode | App loads without internet | ✅ |

---

## 🚀 Live Deployment

The platform is officially deployed via Firebase Hosting:
**Live URL:** https://localmart-lucknow.web.app/

> **Note**: This deployment runs our optimized offline-first PWA backed by Realtime Firestore configuration.

---

## 💻 Running Locally

```bash
# Clone the repo
git clone https://github.com/singhhrishabh/Local-Mart.git
cd Local-Mart/public

# Serve with any static file server
python3 -m http.server 8080
# or
npx serve .

# Open in browser
open http://localhost:8080
```

---

## 🏗️ Tech Stack

| Layer | Technology |
|:---|:---|
| Frontend | Vanilla HTML/CSS/JS |
| Backend | Firebase (Firestore + Auth) |
| Maps | Leaflet.js |
| Offline | Service Worker + IndexedDB |
| Communication | WhatsApp/SMS deep links |
| Payment | COD (Cash on Delivery) |

---

## 📋 Key Design Decisions

1. **Local-First Data**: DEMOS array is always loaded first, Firestore enriches. This guarantees the app works even if Firebase is unreachable.
2. **No Build Step**: Pure vanilla JS — no frameworks, no bundlers. Drop `public/` on any static host.
3. **Cache Busting**: All JS files use `?v=6` query params; SW cache version `lm-v6` forces updates.
4. **No 200KB Constraint**: Prioritized code readability, comprehensive features, and maintainability over bundle size.

---

## 📜 License

MIT © 2026 LocalMart

<div align="center">

## 👤 Author

Built by **Rishabh** — B.E. ECE, BITS Pilani Dubai Campus  
Project developed as part of independent startup exploration, 2026.


</div>
