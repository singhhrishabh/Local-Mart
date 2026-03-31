// ═══ LocalMart — i18n: Hindi / English Toggle ═══
// All UI strings. Access via T('key'). Switch via setLang('hi'|'en').

let _lang = localStorage.getItem('lm_lang') || 'hi';

const STRINGS = {
  // ── Auth ──
  sign_in: { en: 'Sign In', hi: 'साइन इन' }, sign_up: { en: 'Sign Up', hi: 'साइन अप' },
  email: { en: 'Email', hi: 'ईमेल' }, password: { en: 'Password', hi: 'पासवर्ड' },
  phone: { en: 'Phone', hi: 'फ़ोन' }, otp: { en: 'OTP', hi: 'ओटीपी' },
  first_name: { en: 'First Name', hi: 'पहला नाम' }, last_name: { en: 'Last Name', hi: 'अंतिम नाम' },
  login_email: { en: 'Email + Password', hi: 'ईमेल + पासवर्ड' },
  login_phone: { en: 'Phone + OTP', hi: 'फ़ोन + ओटीपी' },
  new_here: { en: 'New here?', hi: 'नए हैं?' }, have_account: { en: 'Have account?', hi: 'पहले से अकाउंट है?' },
  create_account: { en: 'Create Account →', hi: 'अकाउंट बनाएँ →' },

  // ── Nav ──
  home: { en: 'Home', hi: 'होम' }, orders: { en: 'Orders', hi: 'ऑर्डर' },
  inventory: { en: 'Inventory', hi: 'सामान' }, profile: { en: 'Profile', hi: 'प्रोफ़ाइल' },
  sign_out: { en: 'Sign Out', hi: 'साइन आउट' }, help: { en: 'Help', hi: 'मदद' },
  shops: { en: 'Shops', hi: 'दुकानें' }, food: { en: 'Food', hi: 'खाना' },
  services: { en: 'Services', hi: 'सेवाएँ' }, my_orders: { en: 'My Orders', hi: 'मेरे ऑर्डर' },
  cart: { en: 'Cart', hi: 'कार्ट' }, deliver: { en: 'Deliver', hi: 'डिलीवर' },
  back: { en: 'Back', hi: 'वापस' }, all: { en: 'All', hi: 'सभी' },
  packages: { en: 'Packages', hi: 'पैकेज' }, active: { en: 'Active', hi: 'एक्टिव' },
  history: { en: 'History', hi: 'इतिहास' }, earn: { en: 'Earn', hi: 'कमाई' },

  // ── Vendor ──
  dashboard: { en: 'Dashboard', hi: 'डैशबोर्ड' },
  go_live: { en: 'Go Live', hi: 'लाइव जाएँ' },
  offline: { en: 'Offline', hi: 'ऑफ़लाइन' },
  live: { en: 'Live!', hi: 'लाइव!' },
  add_item: { en: '＋ Add Item', hi: '＋ आइटम जोड़ें' },
  add_dish: { en: '＋ Add Dish', hi: '＋ डिश जोड़ें' },
  add_service: { en: '＋ Add Service', hi: '＋ सेवा जोड़ें' },
  shop_name: { en: 'Shop Name', hi: 'दुकान का नाम' },
  save: { en: 'Save Changes', hi: 'बदलाव सहेजें' },
  accept: { en: '✓ Accept', hi: '✓ स्वीकार' },
  reject: { en: '✕ Reject', hi: '✕ अस्वीकार' },
  decline_reason: { en: 'Reason for Decline', hi: 'अस्वीकार का कारण' },
  visibility: { en: 'Shop Visibility', hi: 'दुकान दिखाई दे' },
  opens_at: { en: 'Opens at:', hi: 'खुलेगी:' },
  items: { en: 'Items', hi: 'आइटम' }, available: { en: 'Available', hi: 'उपलब्ध' },
  pending_orders: { en: 'Pending Orders', hi: 'लंबित ऑर्डर' },
  completed: { en: 'Completed Today', hi: 'आज पूरे हुए' },
  offline_warn: { en: 'You have {0} active orders. Going offline won\'t cancel them — sure?', hi: 'आपके {0} चालू ऑर्डर हैं। ऑफ़लाइन जाने से वे रद्द नहीं होंगे — पक्का?' },
  alt_shop: { en: '🏪 Try another shop nearby', hi: '🏪 पास की दूसरी दुकान देखें' },

  // ── Customer ──
  place_order: { en: 'Place Order →', hi: 'ऑर्डर करें →' },
  checkout: { en: 'Checkout →', hi: 'चेकआउट →' },
  delivery_addr: { en: 'Delivery Address', hi: 'डिलीवरी पता' },
  cod: { en: '💵 Cash on Delivery', hi: '💵 कैश ऑन डिलीवरी' },
  order_placed: { en: 'Order Placed!', hi: 'ऑर्डर हो गया!' },
  order_queued: { en: '📴 Saved offline! Will sync when online.', hi: '📴 ऑफ़लाइन सेव! ऑनलाइन होने पर सिंक होगा।' },
  retry: { en: '🔄 Retry', hi: '🔄 फिर से करें' },
  order_via_sms: { en: '📱 Order via SMS', hi: '📱 SMS से ऑर्डर करें' },
  search: { en: 'Search shops, food, services...', hi: 'दुकान, खाना, सेवाएँ खोजें...' },
  no_results: { en: 'Nothing found right now', hi: 'अभी कुछ नहीं मिला' },
  all_near: { en: 'ALL NEAR YOU', hi: 'आपके पास सभी' },
  cart_empty: { en: 'Cart is empty', hi: 'कार्ट खाली है' },
  open: { en: 'Open', hi: 'खुला' }, closed: { en: 'Closed', hi: 'बंद' },
  voice_hint: { en: '🎤 Say what you need in Hindi...', hi: '🎤 हिंदी में बोलें क्या चाहिए...' },

  // ── Carrier ──
  carrier_mode: { en: '📦 Package Carrier', hi: '📦 पैकेज कैरियर' },
  on_route: { en: 'On Route', hi: 'रास्ते पर' },
  off_duty: { en: 'Off Duty', hi: 'छुट्टी पर' },
  where_going: { en: 'Where are you heading?', hi: 'आप कहाँ जा रहे हैं?' },
  step1_dest: { en: 'Step 1: Your Destination', hi: 'स्टेप 1: आपकी मंज़िल' },
  step2_match: { en: 'Step 2: Matching Packages', hi: 'स्टेप 2: मिलते पैकेज' },
  picked_up: { en: 'Picked Up!', hi: 'उठा लिया!' },
  delivered: { en: 'Delivered!', hi: 'डिलीवर हो गया!' },
  your_earnings: { en: 'Your Earnings', hi: 'आपकी कमाई' },

  // ── Admin ──
  admin_panel: { en: 'Admin Panel', hi: 'एडमिन पैनल' },
  vendors: { en: 'Vendors', hi: 'विक्रेता' }, customers: { en: 'Customers', hi: 'ग्राहक' },
  carriers: { en: 'Carriers', hi: 'कैरियर' }, audit_log: { en: 'Audit Log', hi: 'ऑडिट लॉग' },
  all_orders: { en: 'All Orders', hi: 'सभी ऑर्डर' },

  // ── General ──
  loading: { en: 'Loading...', hi: 'लोड हो रहा...' },
  confirm: { en: 'Confirm', hi: 'पक्का करें' },
  cancel: { en: 'Cancel', hi: 'रद्द करें' },
  customer_mode: { en: 'Customer Mode', hi: 'ग्राहक मोड' },
  carrier_switch: { en: 'Carrier Mode', hi: 'कैरियर मोड' },
  local_se_local: { en: 'Local se Local', hi: 'लोकल से लोकल' },
  pratapgarh: { en: 'Pratapgarh & Jaunpur', hi: 'प्रतापगढ़ और जौनपुर' },
};

/* Get translated string */
function T(key) { return STRINGS[key]?.[_lang] || STRINGS[key]?.en || key; }

/* Set language and update all [data-i18n] elements */
function setLang(lang) {
  _lang = lang; localStorage.setItem('lm_lang', lang);
  document.querySelectorAll('[data-i18n]').forEach(el => {
    const k = el.getAttribute('data-i18n');
    if (el.tagName === 'INPUT' || el.tagName === 'TEXTAREA') el.placeholder = T(k);
    else el.textContent = T(k);
  });
  document.documentElement.lang = lang === 'hi' ? 'hi' : 'en';
  // Update toggle button text
  const btn = document.getElementById('langToggle');
  if (btn) btn.textContent = lang === 'hi' ? 'EN' : 'हिं';
  toast(lang === 'hi' ? 'भाषा: हिंदी' : 'Language: English', 'green');
}

function getLang() { return _lang; }
function toggleLang() { setLang(_lang === 'hi' ? 'en' : 'hi'); }
