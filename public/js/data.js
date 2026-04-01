// ═══ LocalMart — Data Layer (Unified Marketplace Platform) ═══

function ht(h) { const t = new Date(); t.setHours(t.getHours() + h); return t.toTimeString().slice(0, 5); }

// Pre-registered test accounts (matches Unified Marketplace Credential Manifest)
const DEMOS = [
  // ─── A. VENDORS & FOOD STALLS (7 accounts) ───
  { id: 'v1', email: 'gupta.dairy@mail.com', password: 'dairy123', role: 'vendor', type: 'shop',
    fname: 'Suresh', lname: 'Gupta', phone: '9812345678', bizName: 'Gupta Dairy Fresh',
    category: 'shop|🧴 Dairy', address: 'Katra, Pratapgarh', isLive: true, opensAt: '', mapX: 200, mapY: 115,
    items: [
      { id: 'd1', name: 'Full Fat Doodh', price: 60, unit: 'per litre', emoji: '🥛', avail: true, stock: 25 },
      { id: 'd2', name: 'Paneer', price: 120, unit: 'per 200g', emoji: '🧀', avail: true, stock: 15 },
      { id: 'd3', name: 'Dahi', price: 40, unit: 'per 400g', emoji: '🫙', avail: true, stock: 20 },
      { id: 'd4', name: 'Makhan', price: 55, unit: 'per 100g', emoji: '🧈', avail: false, stock: 0 }
    ]
  },
  { id: 'v2', email: 'sharma.bakery@mail.com', password: 'bakery123', role: 'vendor', type: 'food',
    fname: 'Mohan', lname: 'Sharma', phone: '9765432100', bizName: 'Sharma Bakery & Sweets',
    category: 'food|🥐 Bakery', address: 'Civil Lines, Pratapgarh', isLive: true, opensAt: '', mapX: 250, mapY: 58,
    items: [
      { id: 'b1', name: 'Fresh Bread', price: 40, unit: 'per loaf', emoji: '🍞', avail: true, stock: 30 },
      { id: 'b2', name: 'Rusks', price: 35, unit: 'per pack', emoji: '🥐', avail: true, stock: 18 },
      { id: 'b3', name: 'Gulab Jamun (6pcs)', price: 60, unit: 'per box', emoji: '🍮', avail: true, stock: 12 },
      { id: 'b4', name: 'Cake Pastry', price: 80, unit: 'per piece', emoji: '🎂', avail: true, stock: 8 }
    ]
  },
  { id: 'v3', email: 'sharma.veg@mail.com', password: 'veg123', role: 'vendor', type: 'shop',
    fname: 'Ramesh', lname: 'Sharma', phone: '9876543210', bizName: 'Sharma Fresh Sabzi',
    category: 'shop|🥦 Vegetables', address: 'Bela, Pratapgarh', isLive: true, opensAt: '', mapX: 108, mapY: 72,
    items: [
      { id: 'i1', name: 'Palak', price: 20, unit: 'per 250g', emoji: '🥬', avail: true, stock: 40 },
      { id: 'i2', name: 'Tamatar', price: 30, unit: 'per kg', emoji: '🍅', avail: true, stock: 35 },
      { id: 'i3', name: 'Methi', price: 15, unit: 'per bunch', emoji: '🌿', avail: false, stock: 0 },
      { id: 'i4', name: 'Dhaniya', price: 10, unit: 'per bunch', emoji: '🌱', avail: true, stock: 50 },
      { id: 'i5', name: 'Hari Mirch', price: 20, unit: 'per 100g', emoji: '🌶️', avail: true, stock: 3 }
    ]
  },
  { id: 'v4', email: 'meena.saree@mail.com', password: 'saree123', role: 'vendor', type: 'shop',
    fname: 'Meena', lname: 'Devi', phone: '9876001234', bizName: 'Meena Saree Collection',
    category: 'shop|👗 Clothing', address: 'Sadar Bazaar, Pratapgarh', isLive: true, opensAt: '', mapX: 155, mapY: 148,
    items: [
      { id: 'cl1', name: 'Cotton Saree', price: 450, unit: 'per piece', emoji: '👗', avail: true, stock: 20 },
      { id: 'cl2', name: 'Chikankari Kurta', price: 380, unit: 'per piece', emoji: '👘', avail: true, stock: 15 },
      { id: 'cl3', name: 'Dupatta Set', price: 250, unit: 'per set', emoji: '🧣', avail: true, stock: 25 }
    ]
  },
  { id: 'v5', email: 'raju.kachori@mail.com', password: 'kachori123', role: 'vendor', type: 'food',
    fname: 'Raju', lname: 'Verma', phone: '9900112233', bizName: 'Raju Kachori Wala',
    category: 'food|🍽️ Chaat', address: 'Bela Chauraha, Pratapgarh', isLive: true, opensAt: '', mapX: 62, mapY: 138,
    items: [
      { id: 'kc1', name: 'Kachori (2pcs)', price: 25, unit: 'per plate', emoji: '🥟', avail: true, stock: 60 },
      { id: 'kc2', name: 'Samosa (2pcs)', price: 20, unit: 'per plate', emoji: '🔺', avail: true, stock: 50 },
      { id: 'kc3', name: 'Jalebi', price: 30, unit: 'per 100g', emoji: '🍩', avail: true, stock: 4 },
      { id: 'kc4', name: 'Aloo Tikki', price: 30, unit: 'per plate', emoji: '🥔', avail: true, stock: 40 }
    ]
  },
  { id: 'v6', email: 'royal.chaat@mail.com', password: 'chaat123', role: 'vendor', type: 'food',
    fname: 'Radhelal', lname: 'Singh', phone: '9988776655', bizName: 'Royal Chaat Bhandaar',
    category: 'food|🍽️ Chaat', address: 'Machhlishahr, Jaunpur', isLive: true, opensAt: '', mapX: 218, mapY: 48,
    items: [
      { id: 'ch1', name: 'Gol Gappa (6pcs)', price: 20, unit: 'per plate', emoji: '🫧', avail: true, stock: 80 },
      { id: 'ch2', name: 'Basket Chaat', price: 40, unit: 'per plate', emoji: '🥣', avail: true, stock: 30 },
      { id: 'ch3', name: 'Bhel Puri', price: 30, unit: 'per plate', emoji: '🥙', avail: true, stock: 35 },
      { id: 'ch4', name: 'Pav Bhaji', price: 50, unit: 'per plate', emoji: '🍛', avail: true, stock: 2 }
    ]
  },
  { id: 'v7', email: 'pappu.kirana@mail.com', password: 'kirana123', role: 'vendor', type: 'shop',
    fname: 'Pappu', lname: 'Agarwal', phone: '9988001122', bizName: 'Pappu Kirana Store',
    category: 'shop|🛒 Kirana', address: 'Sadar Bazaar, Pratapgarh', isLive: false, opensAt: ht(1.5), mapX: 55, mapY: 155,
    items: [
      { id: 'k1', name: 'Tata Namak 1kg', price: 22, unit: 'per pack', emoji: '🧂', avail: true, stock: 100 },
      { id: 'k2', name: 'Atta 5kg', price: 195, unit: 'per bag', emoji: '🌾', avail: true, stock: 28 },
      { id: 'k3', name: 'Maggi', price: 14, unit: 'per pack', emoji: '🍜', avail: true, stock: 5 }
    ]
  },

  // ─── B. LOGISTICS (Carriers) ───
  { id: 'r1', email: 'rider1@mail.com', password: 'rider123', role: 'rider',
    fname: 'Rahul', lname: 'Kumar', phone: '9111111111', isLive: false,
    routeFrom: 'Bela', routeTo: 'Sadar Bazaar', mapX: 140, mapY: 100, earnings: 0, deliveries: 0 },
  { id: 'r2', email: 'rider2@mail.com', password: 'rider123', role: 'rider',
    fname: 'Amit', lname: 'Verma', phone: '9222222222', isLive: false,
    routeFrom: 'Katra', routeTo: 'Civil Lines', mapX: 80, mapY: 60, earnings: 0, deliveries: 0 },

  // ─── C. CUSTOMERS ───
  { id: 'c1', email: 'customer@mail.com', password: 'customer123', role: 'customer',
    fname: 'Priya', lname: 'Mehta', phone: '9090909090' },
  { id: 'c2', email: 'customer2@mail.com', password: 'customer123', role: 'customer',
    fname: 'Arjun', lname: 'Nair', phone: '9191919191' },

  // ─── ADMIN ───
  { id: 'admin1', email: 'admin@localmart.in', password: 'admin123', role: 'admin',
    fname: 'Super', lname: 'Admin', phone: '9000000000' },
];

const FAQS = [
  { q: 'ऑर्डर कैसे काम करता है?', a: 'ग्राहक ऑर्डर करता है → दुकानदार स्वीकार करता है → कैरियर को सूचना → कैरियर उठाता है → लाइव ट्रैकिंग → डिलीवरी पूरी।' },
  { q: 'Package carrier tracking कैसे करें?', a: 'जब कैरियर "Picked Up" दबाता है, मैप पर लाइव डॉट दिखता है जो आपकी तरफ बढ़ता है।' },
  { q: '"Book Now" vs "Schedule" क्या है?', a: '"Book Now" = ~15 मिनट में आएगा। "Schedule" = दिन और समय चुनें।' },
  { q: 'कैरियर को पैसे कैसे मिलते हैं?', a: 'कैरियर ₹40-₹80 per delivery कमाता है। Dashboard पर कमाई दिखती है।' },
  { q: 'ऑफ़लाइन ऑर्डर कैसे करें?', a: 'इंटरनेट नहीं है? ऑर्डर फ़ोन में सेव होगा और ऑनलाइन आने पर अपने-आप भेजा जाएगा।' },
  { q: 'भाषा कैसे बदलें?', a: 'ऊपर EN/हिं बटन दबाएँ — हिंदी और English दोनों में देखें।' },
];

// Quick Chat pre-defined tags
const QUICK_CHAT = [
  { label: '📍 I have arrived', msg: 'I have arrived at the location' },
  { label: '🚪 Leave at gate', msg: 'Please leave at the gate' },
  { label: '⏳ On my way', msg: 'On my way, reaching in 5 mins' },
  { label: '📞 Call me', msg: 'Please call me on my number' },
  { label: '🔔 Order ready', msg: 'Your order is ready for pickup' },
];

// Low-stock threshold
const LOW_STOCK_THRESHOLD = 5;

// Account lockout tracker
const _loginAttempts = {};
const MAX_LOGIN_ATTEMPTS = 5;
const LOCKOUT_DURATION = 5 * 60 * 1000; // 5 minutes

function isAccountLocked(email) {
  const a = _loginAttempts[email];
  if (!a) return false;
  if (a.count >= MAX_LOGIN_ATTEMPTS && Date.now() - a.lastAttempt < LOCKOUT_DURATION) return true;
  if (a.count >= MAX_LOGIN_ATTEMPTS && Date.now() - a.lastAttempt >= LOCKOUT_DURATION) { delete _loginAttempts[email]; return false; }
  return false;
}

function recordLoginAttempt(email, success) {
  if (success) { delete _loginAttempts[email]; return; }
  if (!_loginAttempts[email]) _loginAttempts[email] = { count: 0, lastAttempt: 0 };
  _loginAttempts[email].count++;
  _loginAttempts[email].lastAttempt = Date.now();
}

// ═══════════════════════════════════════════════════════
// DATABASE — LOCAL-FIRST ARCHITECTURE
// DEMOS are ALWAYS loaded first, then Firestore enriches
let DB = { users: [], orders: [], serviceRequests: [], currentUser: null, cart: [] };

async function loadDB() {
  // STEP 1: Always start with DEMOS (local-first — guarantees data is available)
  DB.users = DEMOS.map(d => ({...d})); // deep-ish copy
  console.log('[loadDB] Initialized with', DB.users.length, 'DEMO users');

  if (!db) {
    console.warn("Firestore not available! Using local data only.");
    return;
  }

  // Load purely local state (cart, current user session)
  try {
    const r = localStorage.getItem('lm6_localState');
    if (r) {
      const state = JSON.parse(r);
      DB.currentUser = state.currentUser;
      DB.cart = state.cart || [];
    }
  } catch (e) {}

  // Seed Firestore with demo users
  try {
    const usersSnapshot = await db.collection("users").get();
    const existingEmails = new Set(usersSnapshot.docs.map(d => d.data().email));
    console.log('[loadDB] Firestore has', usersSnapshot.size, 'users');

    // Merge Firestore users into DB (add any non-demo users)
    for (const doc of usersSnapshot.docs) {
      const data = { id: doc.id, ...doc.data() };
      const existing = DB.users.find(u => u.email === data.email);
      if (existing) {
        // Update demo user with Firestore data (preserves any edits)
        Object.assign(existing, data);
      } else {
        DB.users.push(data);
      }
    }

    // Seed missing demo users to Firestore
    for (const demo of DEMOS) {
      if (!existingEmails.has(demo.email)) {
        console.log('Seeding to Firestore:', demo.email);
        db.collection("users").doc(demo.id).set(demo).catch(() => {});
      }
    }
  } catch (e) {
    console.error('[loadDB] Firestore read failed, using local data:', e.message);
  }

  // ─── Attach Live Listeners ───
  try {
    db.collection("users").onSnapshot((snapshot) => {
      const firestoreUsers = snapshot.docs.map(doc => ({ id: doc.id, ...doc.data() }));
      // Start with DEMOS, then merge Firestore data on top
      const merged = DEMOS.map(d => ({...d}));
      for (const fu of firestoreUsers) {
        const idx = merged.findIndex(u => u.email === fu.email);
        if (idx >= 0) Object.assign(merged[idx], fu);
        else merged.push(fu);
      }
      DB.users = merged;
      console.log('[onSnapshot] DB.users:', DB.users.length);
      if (DB.currentUser) {
        const freshMe = DB.users.find(u => u.id === DB.currentUser);
        if (freshMe) maybeReRenderDash(freshMe.role);
      }
      if (document.getElementById('custScreen') && !document.getElementById('custScreen').classList.contains('hidden')) {
        if (typeof renderHome === 'function') renderHome();
      }
      if (typeof adminLiveRefresh === 'function') adminLiveRefresh();
    }, (error) => {
      console.error('[onSnapshot] Users listener error:', error.message);
    });
  } catch(e) {}

  try {
    db.collection("orders").onSnapshot((snapshot) => {
      DB.orders = snapshot.docs.map(doc => ({ id: doc.id, ...doc.data() }));
      if (DB.currentUser) triggerOrderUIRefresh();
    }, () => {});
  } catch(e) {}

  try {
    db.collection("serviceRequests").onSnapshot((snapshot) => {
      DB.serviceRequests = snapshot.docs.map(doc => ({ id: doc.id, ...doc.data() }));
      if (DB.currentUser) triggerOrderUIRefresh();
    }, () => {});
  } catch(e) {}
}

function saveLocalState() {
  try {
    localStorage.setItem('lm6_localState', JSON.stringify({
      currentUser: DB.currentUser,
      cart: DB.cart
    }));
  } catch (e) {}
}

function saveDB() {
  saveLocalState();
  if (!db) return;
  const me = DB.users.find(u => u.id === DB.currentUser);
  if (me) db.collection("users").doc(me.id).set(me, { merge: true }).catch(console.error);
}

// ─── Helpers to refresh UI automatically
function triggerOrderUIRefresh() {
  const me = DB.users.find(u => u.id === DB.currentUser);
  if (!me) return;
  if (me.role === 'vendor' && typeof updateOrderBadge === 'function') updateOrderBadge();
  if (me.role === 'vendor' && typeof renderVendorOrders === 'function') renderVendorOrders();
  if (me.role === 'customer' && typeof renderMyOrders === 'function' && activeSection === 'myorders') renderMyOrders();
  if (typeof refreshRiderPanels === 'function') refreshRiderPanels();
  if (typeof adminLiveRefresh === 'function') adminLiveRefresh();
}

function maybeReRenderDash(role) {
  if (role === 'vendor' && typeof updateLiveUI === 'function') {
    updateLiveUI(); updateDashStats();
    renderInventory(document.querySelector('#panelInventory input')?.value);
  } else if (role === 'rider' && typeof updateRiderLiveUI === 'function') {
    updateRiderLiveUI();
  }
}

// ─── Getter Functions ───
function getCU() { return DB.users.find(u => u.id === DB.currentUser); }
function getVendors() { return DB.users.filter(u => u.role === 'vendor'); }
function getLive() { return getVendors().filter(v => v.isLive); }
function getRiders() { return DB.users.filter(u => u.role === 'rider'); }
function getLiveRiders() { return getRiders().filter(r => r.isLive); }

// ─── Fuzzy Search ───
function fuzzyMatch(text, query) {
  if (!query) return true;
  const t = text.toLowerCase(), q = query.toLowerCase();
  if (t.includes(q)) return true;
  // Levenshtein-style: allow 1-2 char errors
  let qi = 0;
  for (let i = 0; i < t.length && qi < q.length; i++) {
    if (t[i] === q[qi]) qi++;
  }
  return qi >= q.length * 0.7; // 70% match threshold
}

// ─── Low-Stock Alert Check ───
function checkLowStock(vendor) {
  if (!vendor || !vendor.items) return [];
  return vendor.items.filter(i => i.avail && (i.stock || 0) <= LOW_STOCK_THRESHOLD && (i.stock || 0) > 0);
}

// ─── Rider Batching (group orders within 1km) ───
function getBatchableOrders(vendorId) {
  const pending = DB.orders.filter(o => o.vendorId === vendorId && o.status === 'vendor_accepted');
  if (pending.length < 2) return [];
  // Group by proximity (simplified: same area keyword)
  const groups = {};
  pending.forEach(o => {
    const area = (o.address || '').split(',')[0].trim().toLowerCase() || 'unknown';
    if (!groups[area]) groups[area] = [];
    groups[area].push(o);
  });
  return Object.values(groups).filter(g => g.length >= 2);
}

function nearestRider(vendorId) {
  const vendor = DB.users.find(u => u.id === vendorId);
  if (!vendor) return null;
  const liveRiders = getLiveRiders().filter(r => {
    const hasActive = DB.orders.some(o => o.riderId === r.id && ['rider_assigned', 'picked_up'].includes(o.status));
    return !hasActive;
  });
  if (!liveRiders.length) return null;
  return liveRiders.reduce((nearest, r) => {
    const d = Math.hypot(r.mapX - vendor.mapX, r.mapY - vendor.mapY);
    const dn = nearest ? Math.hypot(nearest.mapX - vendor.mapX, nearest.mapY - vendor.mapY) : Infinity;
    return d < dn ? r : nearest;
  }, null);
}
