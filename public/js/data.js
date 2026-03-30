// ═══════════════════════════════════════════════════════
// LocalMart — Data Layer (Firebase Firestore)
// Location: Lucknow, Uttar Pradesh
// ═══════════════════════════════════════════════════════

function ht(h) { const t = new Date(); t.setHours(t.getHours() + h); return t.toTimeString().slice(0, 5); }

// Same DEMOS as before, used only for initial seeding
const DEMOS = [
  // ─── VENDORS (Shops) ───
  { id: 'v1', email: 'vendor.vegetable@mail.com', password: 'vegetable123', role: 'vendor', type: 'shop',
    fname: 'Ramesh', lname: 'Sharma', phone: '9876543210', bizName: 'Sharma Fresh Vegetables',
    category: 'shop|🥦 Vegetables', address: 'Aminabad, Near Gol Darwaza', isLive: true, opensAt: '', mapX: 108, mapY: 72,
    items: [
      { id: 'i1', name: 'Palak', price: 20, unit: 'per 250g', emoji: '🥬', avail: true },
      { id: 'i2', name: 'Tomatoes', price: 30, unit: 'per kg', emoji: '🍅', avail: true },
      { id: 'i3', name: 'Methi', price: 15, unit: 'per bunch', emoji: '🌿', avail: false },
      { id: 'i4', name: 'Coriander', price: 10, unit: 'per bunch', emoji: '🌱', avail: true },
      { id: 'i5', name: 'Green Chilli', price: 20, unit: 'per 100g', emoji: '🌶️', avail: true }
    ]
  },
  { id: 'v2', email: 'vendor.dairy@mail.com', password: 'dairy123', role: 'vendor', type: 'shop',
    fname: 'Suresh', lname: 'Gupta', phone: '9812345678', bizName: 'Gupta Dairy Fresh',
    category: 'shop|🧴 Dairy', address: 'Gomti Nagar, Vipin Khand', isLive: true, opensAt: '', mapX: 200, mapY: 115,
    items: [
      { id: 'd1', name: 'Full Fat Milk', price: 60, unit: 'per litre', emoji: '🥛', avail: true },
      { id: 'd2', name: 'Paneer', price: 120, unit: 'per 200g', emoji: '🧀', avail: true },
      { id: 'd3', name: 'Dahi', price: 40, unit: 'per 400g', emoji: '🫙', avail: true },
      { id: 'd4', name: 'Butter', price: 55, unit: 'per 100g', emoji: '🧈', avail: false }
    ]
  },
  { id: 'v3', email: 'vendor.kirana@mail.com', password: 'kirana123', role: 'vendor', type: 'shop',
    fname: 'Pappu', lname: 'Agarwal', phone: '9988001122', bizName: 'Pappu Kirana Store',
    category: 'shop|🛒 Kirana', address: 'Hazratganj, Opp. Mayfair Cinema', isLive: false, opensAt: ht(1.5), mapX: 55, mapY: 155,
    items: [
      { id: 'k1', name: 'Tata Salt 1kg', price: 22, unit: 'per pack', emoji: '🧂', avail: true },
      { id: 'k2', name: 'Atta 5kg', price: 195, unit: 'per bag', emoji: '🌾', avail: true },
      { id: 'k3', name: 'Maggi', price: 14, unit: 'per pack', emoji: '🍜', avail: true }
    ]
  },
  { id: 'v4', email: 'vendor.saree@mail.com', password: 'saree123', role: 'vendor', type: 'shop',
    fname: 'Meena', lname: 'Devi', phone: '9090123456', bizName: 'Meena Saree Collection',
    category: 'shop|👗 Clothing', address: 'Chowk, Nakhas Bazaar', isLive: false, opensAt: ht(3), mapX: 240, mapY: 160,
    items: [
      { id: 's1', name: 'Cotton Saree', price: 499, unit: 'per piece', emoji: '👗', avail: true },
      { id: 's2', name: 'Chikankari Kurta', price: 1299, unit: 'per piece', emoji: '🎀', avail: true },
      { id: 's3', name: 'Dupatta', price: 199, unit: 'per piece', emoji: '🧣', avail: true }
    ]
  },

  // ─── FOOD VENDORS ───
  { id: 'f1', email: 'food.chaat@mail.com', password: 'chaat123', role: 'vendor', type: 'food',
    fname: 'Radhelal', lname: 'Verma', phone: '9876001234', bizName: 'Royal Chaat Bhandaar',
    category: 'food|🍽️ Chaat', address: 'Aminabad, Near Tunday Kebabi', isLive: true, opensAt: '', mapX: 155, mapY: 148,
    items: [
      { id: 'ch1', name: 'Gol Gappa (6pcs)', price: 20, unit: 'per plate', emoji: '🫧', avail: true },
      { id: 'ch2', name: 'Basket Chaat', price: 40, unit: 'per plate', emoji: '🥣', avail: true },
      { id: 'ch3', name: 'Aloo Tikki Chaat', price: 30, unit: 'per plate', emoji: '🥔', avail: true },
      { id: 'ch4', name: 'Bhel Puri', price: 30, unit: 'per plate', emoji: '🥙', avail: true }
    ]
  },
  { id: 'f2', email: 'food.kachori@mail.com', password: 'kachori123', role: 'vendor', type: 'food',
    fname: 'Raju', lname: 'Halwai', phone: '9800112233', bizName: 'Raju Kachori Wala',
    category: 'food|🍽️ Chaat', address: 'Chowk, Morning Market', isLive: false, opensAt: ht(2), mapX: 70, mapY: 90,
    items: [
      { id: 'ka1', name: 'Khasta Kachori', price: 15, unit: 'per piece', emoji: '🫔', avail: true },
      { id: 'ka2', name: 'Kachori Sabzi', price: 60, unit: 'per plate', emoji: '🍱', avail: true },
      { id: 'ka3', name: 'Samosa', price: 10, unit: 'per piece', emoji: '🥟', avail: true }
    ]
  },
  { id: 'f3', email: 'food.bakery@mail.com', password: 'bakery123', role: 'vendor', type: 'food',
    fname: 'Mohan', lname: 'Singh', phone: '9765432100', bizName: 'Sharma Bakery & Sweets',
    category: 'food|🥐 Bakery', address: 'Aliganj, Near Wave Mall', isLive: true, opensAt: '', mapX: 250, mapY: 58,
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
    category: 'service|🔧 Plumbing', address: 'Indira Nagar, Sector 12', isLive: true, opensAt: '', mapX: 62, mapY: 138,
    items: [
      { id: 'sv1', name: 'Pipe Leak Repair', price: 300, unit: 'per visit', emoji: '🔧', avail: true, desc: 'Fix any pipe leaks' },
      { id: 'sv2', name: 'Tap Installation', price: 200, unit: 'per tap', emoji: '🚿', avail: true, desc: 'Install/replace taps' },
      { id: 'sv3', name: 'Drain Cleaning', price: 400, unit: 'per drain', emoji: '🪣', avail: true, desc: 'Unclog drains' }
    ]
  },
  { id: 's2', email: 'service.maid@mail.com', password: 'maid123', role: 'vendor', type: 'service',
    fname: 'Savita', lname: 'Devi', phone: '8877665544', bizName: 'CleanHome Maid Services',
    category: 'service|🧹 Maid', address: 'Rajajipuram, C Block', isLive: true, opensAt: '', mapX: 218, mapY: 48,
    items: [
      { id: 'm1', name: 'Daily Maid (2hrs)', price: 1500, unit: 'per month', emoji: '🧹', avail: true, desc: 'Morning 2 hrs/day' },
      { id: 'm2', name: 'One-time Deep Clean', price: 800, unit: 'per session', emoji: '✨', avail: true, desc: 'Full house cleaning' }
    ]
  },
  { id: 's3', email: 'service.ac@mail.com', password: 'ac123', role: 'vendor', type: 'service',
    fname: 'Ravi', lname: 'Yadav', phone: '9900112233', bizName: 'Ravi CoolTech AC',
    category: 'service|❄️ AC Service', address: 'Kapoorthala, Near KGMU', isLive: true, opensAt: '', mapX: 178, mapY: 170,
    items: [
      { id: 'ac1', name: 'AC Service (1 ton)', price: 500, unit: 'per AC', emoji: '❄️', avail: true, desc: 'Full clean & gas check' },
      { id: 'ac2', name: 'AC Repair', price: 350, unit: 'per visit', emoji: '🔩', avail: true, desc: 'Diagnosis + basic repair' },
      { id: 'ac3', name: 'AC Installation', price: 1500, unit: 'per unit', emoji: '🏗️', avail: true, desc: 'New AC fitting' }
    ]
  },
  { id: 's4', email: 'service.electrician@mail.com', password: 'electrician123', role: 'vendor', type: 'service',
    fname: 'Bijli', lname: 'Bhai', phone: '9988001122', bizName: 'Bijli Bhai Electrician',
    category: 'service|⚡ Electrician', address: 'Husainganj, Near Lucknow Junction', isLive: false, opensAt: ht(1), mapX: 128, mapY: 35,
    items: [
      { id: 'e1', name: 'Switch Repair', price: 150, unit: 'per point', emoji: '🔌', avail: true, desc: 'Fix/replace switches' },
      { id: 'e2', name: 'Fan Installation', price: 250, unit: 'per fan', emoji: '💨', avail: true, desc: 'Ceiling fan fitting' },
      { id: 'e3', name: 'Wiring Work', price: 800, unit: 'per room', emoji: '⚡', avail: true, desc: 'New/repair wiring' }
    ]
  },
  { id: 's5', email: 'service.dryclean@mail.com', password: 'dryclean123', role: 'vendor', type: 'service',
    fname: 'Shubham', lname: 'Dhobhi', phone: '9876543000', bizName: 'Shubham Dry Cleaning',
    category: 'service|👔 Dry Cleaning', address: 'Mahanagar, Near PVR', isLive: false, opensAt: ht(0.5), mapX: 285, mapY: 115,
    items: [
      { id: 'dc1', name: 'Shirt/T-Shirt', price: 40, unit: 'per piece', emoji: '👔', avail: true, desc: 'Dry clean + press' },
      { id: 'dc2', name: 'Suit/Blazer', price: 200, unit: 'per piece', emoji: '🤵', avail: true, desc: 'Full dry cleaning' },
      { id: 'dc3', name: 'Chikankari Kurta', price: 150, unit: 'per piece', emoji: '👗', avail: true, desc: 'Gentle dry clean' }
    ]
  },

  // ─── PACKAGE CARRIERS ───
  { id: 'r1', email: 'carrier1@mail.com', password: 'carrier123', role: 'rider', fname: 'Rahul', lname: 'Kumar', phone: '9111111111', isLive: false, routeFrom: 'Aminabad', routeTo: 'Hazratganj', mapX: 140, mapY: 100, earnings: 0, deliveries: 0 },
  { id: 'r2', email: 'carrier2@mail.com', password: 'carrier123', role: 'rider', fname: 'Amit', lname: 'Verma', phone: '9222222222', isLive: false, routeFrom: 'Indira Nagar', routeTo: 'Gomti Nagar', mapX: 80, mapY: 60, earnings: 0, deliveries: 0 },
  { id: 'r3', email: 'carrier3@mail.com', password: 'carrier123', role: 'rider', fname: 'Sunita', lname: 'Yadav', phone: '9333333333', isLive: false, routeFrom: 'Chowk', routeTo: 'Lucknow Junction', mapX: 200, mapY: 80, earnings: 0, deliveries: 0 },
  { id: 'r4', email: 'carrier4@mail.com', password: 'carrier123', role: 'rider', fname: 'Deepak', lname: 'Singh', phone: '9444444444', isLive: false, routeFrom: 'Aliganj', routeTo: 'Rajajipuram', mapX: 160, mapY: 140, earnings: 0, deliveries: 0 },
  { id: 'r5', email: 'carrier5@mail.com', password: 'carrier123', role: 'rider', fname: 'Vijay', lname: 'Sharma', phone: '9555555555', isLive: false, routeFrom: 'Mahanagar', routeTo: 'Chowk', mapX: 100, mapY: 130, earnings: 0, deliveries: 0 },
  { id: 'r6', email: 'carrier6@mail.com', password: 'carrier123', role: 'rider', fname: 'Raju', lname: 'Gupta', phone: '9666666666', isLive: false, routeFrom: 'Kapoorthala', routeTo: 'Aminabad', mapX: 230, mapY: 150, earnings: 0, deliveries: 0 },
  { id: 'r7', email: 'carrier7@mail.com', password: 'carrier123', role: 'rider', fname: 'Prerna', lname: 'Patel', phone: '9777777777', isLive: false, routeFrom: 'Husainganj', routeTo: 'Gomti Nagar', mapX: 70, mapY: 170, earnings: 0, deliveries: 0 },
  { id: 'r8', email: 'carrier8@mail.com', password: 'carrier123', role: 'rider', fname: 'Sachin', lname: 'Tiwari', phone: '9888888888', isLive: false, routeFrom: 'Gomti Nagar', routeTo: 'Hazratganj', mapX: 250, mapY: 40, earnings: 0, deliveries: 0 },

  // ─── CUSTOMERS ───
  { id: 'c1', email: 'customer@mail.com', password: 'customer123', role: 'customer', fname: 'Priya', lname: 'Mehta', phone: '9090909090' },
  { id: 'c2', email: 'customer2@mail.com', password: 'customer123', role: 'customer', fname: 'Arjun', lname: 'Nair', phone: '9191919191' },
];

const FAQS = [
  { q: 'How does the order flow work?', a: 'Customer places order → Vendor accepts → Nearest available carrier gets notified → Carrier picks up → Live tracking begins → Order delivered.' },
  { q: 'How does package carrier tracking work?', a: 'Once a carrier marks "Picked Up", a live dot appears on the map showing their movement toward your location. Updated every few seconds.' },
  { q: 'What is "Book Now" vs "Schedule" for services?', a: '"Book Now" means the provider will arrive within ~15 minutes. "Schedule" lets you pick a specific date and time slot.' },
  { q: 'What if no service provider is registered for my issue?', a: 'Use the "Don\'t see what you need?" form to describe your issue. Your request is sent to all relevant service providers. They can accept or decline with a reason.' },
  { q: 'How are package carriers paid?', a: 'Carriers earn ₹40 per delivery (short distance) to ₹80 (longer). Their dashboard shows total earnings and deliveries completed.' },
  { q: 'Can I track my order?', a: 'Yes — once your order is picked up, go to My Orders to see live tracking on the map.' },
];

// ═══════════════════════════════════════════════════════
// DATABASE 
// We keep the `DB` object in memory to avoid breaking existing UI code.
// We sync it seamlessly with Firestore using real-time listeners.
// ═══════════════════════════════════════════════════════
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

  // Automatically fetch Demos to seed if DB is empty
  const usersSnapshot = await db.collection("users").get();
  if (usersSnapshot.empty) {
    console.log("Seeding Firestore with Demo Data...");
    for (const user of DEMOS) {
      // Remove hardcoded simple passwords for demo, keep them unauthenticated
      await db.collection("users").doc(user.id).set(user);
    }
  }

  // ─── Attach Listeners ───
  // 1. Users Stream
  db.collection("users").onSnapshot((snapshot) => {
    DB.users = snapshot.docs.map(doc => ({ id: doc.id, ...doc.data() }));
    // If we're logged in, update app UI
    if (DB.currentUser) {
      const freshMe = DB.users.find(u => u.id === DB.currentUser);
      if (freshMe) maybeReRenderDash(freshMe.role);
    }
    // Update map/shops if customer
    if (document.getElementById('custScreen') && !document.getElementById('custScreen').classList.contains('hidden')) {
      if (typeof renderHome === 'function') renderHome();
    }
  });

  // 2. Orders Stream
  db.collection("orders").onSnapshot((snapshot) => {
    DB.orders = snapshot.docs.map(doc => ({ id: doc.id, ...doc.data() }));
    if (DB.currentUser) triggerOrderUIRefresh();
  });

  // 3. Service Requests Stream
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

/** 
 * IMPORTANT: This overwrites specific users/orders in Firestore
 * Instead of completely saving everything, it uploads the changes for the current user/orders.
 * This limits refactoring we have to do in other JS files.
 */
function saveDB() {
  saveLocalState();
  if (!db) return;

  // Sync Current User document immediately
  const me = DB.users.find(u => u.id === DB.currentUser);
  if (me) {
    db.collection("users").doc(me.id).set(me, { merge: true }).catch(console.error);
  }

  // We rely on specific functions (placeOrder, markPickedUp, etc) 
  // to update their own individual docs manually to avoid overwhelming the network with full-array uploads.
}

// ─── Helpers to refresh UI automatically on state changes
function triggerOrderUIRefresh() {
  const me = DB.users.find(u => u.id === DB.currentUser);
  if (!me) return;

  if (me.role === 'vendor' && typeof updateOrderBadge === 'function') updateOrderBadge();
  if (me.role === 'vendor' && typeof renderVendorOrders === 'function') renderVendorOrders();
  if (me.role === 'customer' && typeof renderMyOrders === 'function' && activeSection === 'myorders') renderMyOrders();
  
  // Carrier Mode is universal, it shouldn't be locked to just the 'rider' role
  if (typeof refreshRiderPanels === 'function') refreshRiderPanels();
}

function maybeReRenderDash(role) {
  if (role === 'vendor' && typeof updateLiveUI === 'function') {
    updateLiveUI();
    updateDashStats();
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

/** Find nearest available carrier to a vendor */
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
