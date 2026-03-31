// LocalMart — Data Layer (Pratapgarh & Jaunpur)

function ht(h) { const t = new Date(); t.setHours(t.getHours() + h); return t.toTimeString().slice(0, 5); }

// Demo data seeded into Firestore for first-run (Pratapgarh & Jaunpur addresses)
const DEMOS = [
  // ─── VENDORS (Shops) ───
  { id: 'v1', email: 'vendor.vegetable@mail.com', password: 'vegetable123', role: 'vendor', type: 'shop',
    fname: 'Ramesh', lname: 'Sharma', phone: '9876543210', bizName: 'Sharma Fresh Sabzi',
    category: 'shop|🥦 Vegetables', address: 'Bela, Pratapgarh', isLive: true, opensAt: '', mapX: 108, mapY: 72,
    items: [
      { id: 'i1', name: 'Palak', price: 20, unit: 'per 250g', emoji: '🥬', avail: true },
      { id: 'i2', name: 'Tamatar', price: 30, unit: 'per kg', emoji: '🍅', avail: true },
      { id: 'i3', name: 'Methi', price: 15, unit: 'per bunch', emoji: '🌿', avail: false },
      { id: 'i4', name: 'Dhaniya', price: 10, unit: 'per bunch', emoji: '🌱', avail: true },
      { id: 'i5', name: 'Hari Mirch', price: 20, unit: 'per 100g', emoji: '🌶️', avail: true }
    ]
  },
  { id: 'v2', email: 'vendor.dairy@mail.com', password: 'dairy123', role: 'vendor', type: 'shop',
    fname: 'Suresh', lname: 'Gupta', phone: '9812345678', bizName: 'Gupta Dairy Fresh',
    category: 'shop|🧴 Dairy', address: 'Katra, Pratapgarh', isLive: true, opensAt: '', mapX: 200, mapY: 115,
    items: [
      { id: 'd1', name: 'Full Fat Doodh', price: 60, unit: 'per litre', emoji: '🥛', avail: true },
      { id: 'd2', name: 'Paneer', price: 120, unit: 'per 200g', emoji: '🧀', avail: true },
      { id: 'd3', name: 'Dahi', price: 40, unit: 'per 400g', emoji: '🫙', avail: true },
      { id: 'd4', name: 'Makhan', price: 55, unit: 'per 100g', emoji: '🧈', avail: false }
    ]
  },
  { id: 'v3', email: 'vendor.kirana@mail.com', password: 'kirana123', role: 'vendor', type: 'shop',
    fname: 'Pappu', lname: 'Agarwal', phone: '9988001122', bizName: 'Pappu Kirana Store',
    category: 'shop|🛒 Kirana', address: 'Sadar Bazaar, Pratapgarh', isLive: false, opensAt: ht(1.5), mapX: 55, mapY: 155,
    items: [
      { id: 'k1', name: 'Tata Namak 1kg', price: 22, unit: 'per pack', emoji: '🧂', avail: true },
      { id: 'k2', name: 'Atta 5kg', price: 195, unit: 'per bag', emoji: '🌾', avail: true },
      { id: 'k3', name: 'Maggi', price: 14, unit: 'per pack', emoji: '🍜', avail: true }
    ]
  },
  // ─── FOOD VENDORS ───
  { id: 'f1', email: 'food.chaat@mail.com', password: 'chaat123', role: 'vendor', type: 'food',
    fname: 'Radhelal', lname: 'Verma', phone: '9876001234', bizName: 'Lala Chaat Bhandaar',
    category: 'food|🍽️ Chaat', address: 'Bela Chauraha, Pratapgarh', isLive: true, opensAt: '', mapX: 155, mapY: 148,
    items: [
      { id: 'ch1', name: 'Gol Gappa (6pcs)', price: 20, unit: 'per plate', emoji: '🫧', avail: true },
      { id: 'ch2', name: 'Basket Chaat', price: 40, unit: 'per plate', emoji: '🥣', avail: true },
      { id: 'ch3', name: 'Aloo Tikki', price: 30, unit: 'per plate', emoji: '🥔', avail: true },
      { id: 'ch4', name: 'Bhel Puri', price: 30, unit: 'per plate', emoji: '🥙', avail: true }
    ]
  },
  { id: 'f3', email: 'food.bakery@mail.com', password: 'bakery123', role: 'vendor', type: 'food',
    fname: 'Mohan', lname: 'Singh', phone: '9765432100', bizName: 'Singh Bakery & Sweets',
    category: 'food|🥐 Bakery', address: 'Civil Lines, Pratapgarh', isLive: true, opensAt: '', mapX: 250, mapY: 58,
    items: [
      { id: 'b1', name: 'Fresh Bread', price: 40, unit: 'per loaf', emoji: '🍞', avail: true },
      { id: 'b2', name: 'Rusks', price: 35, unit: 'per pack', emoji: '🥐', avail: true },
      { id: 'b3', name: 'Gulab Jamun (6pcs)', price: 60, unit: 'per box', emoji: '🍮', avail: true },
      { id: 'b4', name: 'Cake Pastry', price: 80, unit: 'per piece', emoji: '🎂', avail: true }
    ]
  },

  // ─── SERVICE PROVIDERS ───
  { id: 's1', email: 'service.plumbing@mail.com', password: 'plumbing123', role: 'vendor', type: 'service',
    fname: 'Vikram', lname: 'Singh', phone: '9988776655', bizName: 'Vikram Plumbing Works',
    category: 'service|🔧 Plumbing', address: 'Manikpur, Pratapgarh', isLive: true, opensAt: '', mapX: 62, mapY: 138,
    items: [
      { id: 'sv1', name: 'Pipe Leak Repair', price: 300, unit: 'per visit', emoji: '🔧', avail: true, desc: 'Fix any pipe leaks' },
      { id: 'sv2', name: 'Tap Installation', price: 200, unit: 'per tap', emoji: '🚿', avail: true, desc: 'Install/replace taps' },
      { id: 'sv3', name: 'Drain Cleaning', price: 400, unit: 'per drain', emoji: '🪣', avail: true, desc: 'Unclog drains' }
    ]
  },
  { id: 's2', email: 'service.maid@mail.com', password: 'maid123', role: 'vendor', type: 'service',
    fname: 'Savita', lname: 'Devi', phone: '8877665544', bizName: 'CleanHome Maid Services',
    category: 'service|🧹 Maid', address: 'Lalganj, Pratapgarh', isLive: true, opensAt: '', mapX: 218, mapY: 48,
    items: [
      { id: 'm1', name: 'Daily Maid (2hrs)', price: 1500, unit: 'per month', emoji: '🧹', avail: true, desc: 'Subah 2 ghante/din' },
      { id: 'm2', name: 'One-time Deep Clean', price: 800, unit: 'per session', emoji: '✨', avail: true, desc: 'Poora ghar saaf' }
    ]
  },
  { id: 's3', email: 'service.ac@mail.com', password: 'ac123', role: 'vendor', type: 'service',
    fname: 'Ravi', lname: 'Yadav', phone: '9900112233', bizName: 'Ravi CoolTech AC',
    category: 'service|❄️ AC Service', address: 'Shahganj, Jaunpur', isLive: true, opensAt: '', mapX: 178, mapY: 170,
    items: [
      { id: 'ac1', name: 'AC Service (1 ton)', price: 500, unit: 'per AC', emoji: '❄️', avail: true, desc: 'Full clean & gas check' },
      { id: 'ac2', name: 'AC Repair', price: 350, unit: 'per visit', emoji: '🔩', avail: true, desc: 'Diagnosis + basic repair' },
      { id: 'ac3', name: 'AC Installation', price: 1500, unit: 'per unit', emoji: '🏗️', avail: true, desc: 'New AC fitting' }
    ]
  },
  { id: 's4', email: 'service.electrician@mail.com', password: 'electrician123', role: 'vendor', type: 'service',
    fname: 'Bijli', lname: 'Bhai', phone: '9988001122', bizName: 'Bijli Bhai Electrician',
    category: 'service|⚡ Electrician', address: 'Kunda, Pratapgarh', isLive: false, opensAt: ht(1), mapX: 128, mapY: 35,
    items: [
      { id: 'e1', name: 'Switch Repair', price: 150, unit: 'per point', emoji: '🔌', avail: true, desc: 'Fix/replace switches' },
      { id: 'e2', name: 'Fan Installation', price: 250, unit: 'per fan', emoji: '💨', avail: true, desc: 'Ceiling fan fitting' },
      { id: 'e3', name: 'Wiring Work', price: 800, unit: 'per room', emoji: '⚡', avail: true, desc: 'New/repair wiring' }
    ]
  },
  { id: 's5', email: 'service.dryclean@mail.com', password: 'dryclean123', role: 'vendor', type: 'service',
    fname: 'Shubham', lname: 'Dhobhi', phone: '9876543000', bizName: 'Shubham Dry Cleaning',
    category: 'service|👔 Dry Cleaning', address: 'Machhlishahr, Jaunpur', isLive: false, opensAt: ht(0.5), mapX: 285, mapY: 115,
    items: [
      { id: 'dc1', name: 'Shirt/T-Shirt', price: 40, unit: 'per piece', emoji: '👔', avail: true, desc: 'Dry clean + press' },
      { id: 'dc2', name: 'Suit/Blazer', price: 200, unit: 'per piece', emoji: '🤵', avail: true, desc: 'Full dry cleaning' },
      { id: 'dc3', name: 'Chikankari Kurta', price: 150, unit: 'per piece', emoji: '👗', avail: true, desc: 'Gentle dry clean' }
    ]
  },

  // ─── PACKAGE CARRIERS ───
  { id: 'r1', email: 'carrier1@mail.com', password: 'carrier123', role: 'rider', fname: 'Rahul', lname: 'Kumar', phone: '9111111111', isLive: false, routeFrom: 'Bela', routeTo: 'Sadar Bazaar', mapX: 140, mapY: 100, earnings: 0, deliveries: 0 },
  { id: 'r2', email: 'carrier2@mail.com', password: 'carrier123', role: 'rider', fname: 'Amit', lname: 'Verma', phone: '9222222222', isLive: false, routeFrom: 'Katra', routeTo: 'Civil Lines', mapX: 80, mapY: 60, earnings: 0, deliveries: 0 },
  // ─── CUSTOMERS ───
  { id: 'c1', email: 'customer@mail.com', password: 'customer123', role: 'customer', fname: 'Priya', lname: 'Mehta', phone: '9090909090' },
  { id: 'c2', email: 'customer2@mail.com', password: 'customer123', role: 'customer', fname: 'Arjun', lname: 'Nair', phone: '9191919191' },

  // ─── ADMIN ───
  { id: 'admin1', email: 'admin@localmart.in', password: 'admin123', role: 'admin', fname: 'Super', lname: 'Admin', phone: '9000000000' },
];

const FAQS = [
  { q: 'ऑर्डर कैसे काम करता है?', a: 'ग्राहक ऑर्डर करता है → दुकानदार स्वीकार करता है → कैरियर को सूचना → कैरियर उठाता है → लाइव ट्रैकिंग → डिलीवरी पूरी।' },
  { q: 'Package carrier tracking कैसे करें?', a: 'जब कैरियर "Picked Up" दबाता है, मैप पर लाइव डॉट दिखता है जो आपकी तरफ बढ़ता है।' },
  { q: '"Book Now" vs "Schedule" क्या है?', a: '"Book Now" = ~15 मिनट में आएगा। "Schedule" = दिन और समय चुनें।' },
  { q: 'कैरियर को पैसे कैसे मिलते हैं?', a: 'कैरियर ₹40-₹80 per delivery कमाता है। Dashboard पर कमाई दिखती है।' },
  { q: 'ऑफ़लाइन ऑर्डर कैसे करें?', a: 'इंटरनेट नहीं है? ऑर्डर फ़ोन में सेव होगा और ऑनलाइन आने पर अपने-आप भेजा जाएगा।' },
  { q: 'भाषा कैसे बदलें?', a: 'ऊपर EN/हिं बटन दबाएँ — हिंदी और English दोनों में देखें।' },
];

// ═══════════════════════════════════════════════════════
// DATABASE
let DB = { users: [], orders: [], serviceRequests: [], currentUser: null, cart: [] };

async function loadDB() {
  if (!db) {
    console.warn("Firestore not available! Using ephemeral data only.");
    DB.users = [...DEMOS];
    return;
  }

  // Load purely local state (cart, current user session)
  try {
    const r = localStorage.getItem('lm5_localState');
    if (r) {
      const state = JSON.parse(r);
      DB.currentUser = state.currentUser;
      DB.cart = state.cart || [];
    }
  } catch (e) {}

  // Seed if empty
  const usersSnapshot = await db.collection("users").get();
  if (usersSnapshot.empty) {
    console.log("Seeding Firestore with Demo Data...");
    for (const user of DEMOS) {
      await db.collection("users").doc(user.id).set(user);
    }
  }

  // Always ensure admin user exists (in case DB was seeded before admin was added)
  const adminDemo = DEMOS.find(u => u.email === 'admin@localmart.in');
  if (adminDemo) {
    const adminSnap = await db.collection("users").where("email", "==", "admin@localmart.in").limit(1).get();
    if (adminSnap.empty) {
      console.log("Seeding admin user...");
      await db.collection("users").doc(adminDemo.id).set(adminDemo);
    }
  }

  // ─── Attach Listeners ───
  db.collection("users").onSnapshot((snapshot) => {
    DB.users = snapshot.docs.map(doc => ({ id: doc.id, ...doc.data() }));
    if (DB.currentUser) {
      const freshMe = DB.users.find(u => u.id === DB.currentUser);
      if (freshMe) maybeReRenderDash(freshMe.role);
    }
    if (document.getElementById('custScreen') && !document.getElementById('custScreen').classList.contains('hidden')) {
      if (typeof renderHome === 'function') renderHome();
    }
  });

  db.collection("orders").onSnapshot((snapshot) => {
    DB.orders = snapshot.docs.map(doc => ({ id: doc.id, ...doc.data() }));
    if (DB.currentUser) triggerOrderUIRefresh();
  });

  db.collection("serviceRequests").onSnapshot((snapshot) => {
    DB.serviceRequests = snapshot.docs.map(doc => ({ id: doc.id, ...doc.data() }));
    if (DB.currentUser) triggerOrderUIRefresh();
  });
}

function saveLocalState() {
  try {
    localStorage.setItem('lm5_localState', JSON.stringify({
      currentUser: DB.currentUser,
      cart: DB.cart
    }));
  } catch (e) {}
}

function saveDB() {
  saveLocalState();
  if (!db) return;
  const me = DB.users.find(u => u.id === DB.currentUser);
  if (me) {
    db.collection("users").doc(me.id).set(me, { merge: true }).catch(console.error);
  }
}

// ─── Helpers to refresh UI automatically
function triggerOrderUIRefresh() {
  const me = DB.users.find(u => u.id === DB.currentUser);
  if (!me) return;
  if (me.role === 'vendor' && typeof updateOrderBadge === 'function') updateOrderBadge();
  if (me.role === 'vendor' && typeof renderVendorOrders === 'function') renderVendorOrders();
  if (me.role === 'customer' && typeof renderMyOrders === 'function' && activeSection === 'myorders') renderMyOrders();
  if (typeof refreshRiderPanels === 'function') refreshRiderPanels();
  // Refresh admin if open
  if (typeof isAdmin === 'function' && isAdmin(me) && !document.getElementById('adminScreen')?.classList.contains('hidden')) {
    if (typeof renderAdminDash === 'function') renderAdminDash();
  }
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
