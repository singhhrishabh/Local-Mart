// ═══ LocalMart — Auth (Hybrid Login + Account Lockout + RBAC) ═══

let signupRole = 'vendor';
let loginMode = 'email'; // 'email' or 'phone'
let _loginRouting = false;

function switchTab(tab) {
  document.getElementById('loginForm').classList.toggle('hidden', tab !== 'login');
  document.getElementById('signupForm').classList.toggle('hidden', tab !== 'signup');
  document.querySelectorAll('.atab').forEach((b, i) =>
    b.classList.toggle('act', (i === 0 && tab === 'login') || (i === 1 && tab === 'signup'))
  );
  ['loginErr', 'signupErr'].forEach(id => document.getElementById(id).classList.add('hidden'));
}

function pickRole(role) {
  signupRole = role;
  ['vendor', 'food', 'service', 'carrier', 'customer'].forEach(r => {
    let el = document.getElementById('rc-' + r);
    if(el) el.classList.toggle('sel', r === role);
  });
  document.getElementById('bizFields').classList.toggle('hidden', role === 'customer' || role === 'carrier');
}

/* Toggle between Email and Phone login */
function toggleLoginMode() {
  loginMode = loginMode === 'email' ? 'phone' : 'email';
  document.getElementById('emailLoginFields').classList.toggle('hidden', loginMode !== 'email');
  document.getElementById('phoneLoginFields').classList.toggle('hidden', loginMode !== 'phone');
  document.getElementById('loginModeBtn').textContent = loginMode === 'email' ? T('login_phone') : T('login_email');
}

/* Phone + OTP login (Demo bypass: OTP 123456 always works) */
async function sendOTP() {
  const phone = document.getElementById('liPhone').value.trim();
  const err = document.getElementById('loginErr');
  if (!phone || phone.length < 10) { err.textContent = 'Enter valid phone number.'; err.classList.remove('hidden'); return; }
  document.getElementById('otpSection').classList.remove('hidden');
  toast('📱 OTP sent to ' + phone + ' (Demo: use 123456)', 'blue');
}

async function verifyOTP() {
  const phone = document.getElementById('liPhone').value.trim();
  const otp = document.getElementById('liOTP').value.trim();
  const err = document.getElementById('loginErr');
  // Demo bypass: OTP 123456 always works
  if (otp !== '123456') { err.textContent = 'Invalid OTP. Demo OTP: 123456'; err.classList.remove('hidden'); return; }
  // Find user by phone in local DEMOS + DB
  const user = DB.users.find(u => u.phone === phone);
  if (user) {
    try {
      const ac = await auth.signInWithEmailAndPassword(user.email, user.password);
      directRoute(ac.user.uid, user);
    } catch(e) {
      try {
        const ac = await auth.createUserWithEmailAndPassword(user.email, user.password);
        await db.collection('users').doc(ac.user.uid).set({...user, id: ac.user.uid});
        directRoute(ac.user.uid, user);
      } catch(e2) {
        // Fallback: local login
        directRoute(user.id, user);
      }
    }
  } else {
    err.textContent = 'No account found with this phone. Please sign up first.';
    err.classList.remove('hidden');
  }
}

/* Direct route helper — bypasses async delays */
function directRoute(uid, d) {
  _loginRouting = true;
  DB.currentUser = uid;
  saveLocalState();
  if (!DB.users.find(u => u.id === uid)) {
    const existing = DB.users.find(u => u.email === d.email);
    if (existing) existing.id = uid;
    else DB.users.push({...d, id: uid});
  }
  loadApp({...d, id: uid});
}

/* Email + Password login with Account Lockout */
async function doLogin() {
  const email = document.getElementById('liEmail').value.trim().toLowerCase();
  const pass = document.getElementById('liPass').value;
  const err = document.getElementById('loginErr');
  err.classList.add('hidden');
  if (!email || !pass) { err.textContent = 'Enter email and password.'; err.classList.remove('hidden'); return; }

  // Account lockout check
  if (isAccountLocked(email)) {
    const remaining = Math.ceil((LOCKOUT_DURATION - (Date.now() - _loginAttempts[email].lastAttempt)) / 60000);
    err.textContent = `🔒 Account locked. Too many failed attempts. Try again in ${remaining} min.`;
    err.classList.remove('hidden'); return;
  }

  // Try Firebase Auth first
  try {
    const ac = await auth.signInWithEmailAndPassword(email, pass), uid = ac.user.uid;
    let ud = DB.users.find(u => u.id === uid);
    if (!ud && db) { try { const d = await db.collection('users').doc(uid).get(); if(d.exists) ud = {id:uid,...d.data()}; } catch(e){} }
    if (!ud) ud = DB.users.find(u => u.email === email);
    if (ud) { recordLoginAttempt(email, true); directRoute(uid, ud); return; }
    if (email === 'admin@localmart.in') { recordLoginAttempt(email, true); directRoute(uid, {email, role:'admin', fname:'Super', lname:'Admin'}); return; }
    recordLoginAttempt(email, true);
    checkAndRouteUser(uid); return;
  } catch(e1) {}

  // Try Firestore fallback (for demo accounts)
  try {
    if (db) {
      const snap = await db.collection("users").where("email","==",email).limit(1).get();
      if (!snap.empty) {
        const ud = snap.docs[0].data(), oid = snap.docs[0].id;
        if (ud.password !== pass) { recordLoginAttempt(email, false); err.textContent = 'Email or password is incorrect.'; err.classList.remove('hidden'); return; }
        try {
          const na = await auth.createUserWithEmailAndPassword(email, pass), nid = na.user.uid;
          if (oid !== nid) { await db.collection("users").doc(nid).set({...ud, id: nid}); await db.collection("users").doc(oid).delete().catch(() => {}); }
          recordLoginAttempt(email, true); directRoute(nid, ud); return;
        } catch(e2) {
          if (e2.code === 'auth/email-already-in-use') { try { const ra = await auth.signInWithEmailAndPassword(email, ud.password); recordLoginAttempt(email, true); directRoute(ra.user.uid, ud); return; } catch(e3){} }
        }
      }
    }
  } catch(e) {}

  // Final fallback: match against local DEMOS array
  const demoUser = DEMOS.find(u => u.email === email && u.password === pass);
  if (demoUser) {
    try {
      const ac = await auth.createUserWithEmailAndPassword(email, pass);
      const uid = ac.user.uid;
      if (db) await db.collection("users").doc(uid).set({...demoUser, id: uid});
      recordLoginAttempt(email, true);
      directRoute(uid, demoUser);
      return;
    } catch(e) {
      if (e.code === 'auth/email-already-in-use') {
        try {
          const ac = await auth.signInWithEmailAndPassword(email, pass);
          recordLoginAttempt(email, true);
          directRoute(ac.user.uid, demoUser);
          return;
        } catch(e2) {}
      }
      // Absolute fallback: local-only login
      recordLoginAttempt(email, true);
      directRoute(demoUser.id, demoUser);
      return;
    }
  }

  recordLoginAttempt(email, false);
  const attempts = _loginAttempts[email]?.count || 0;
  const remaining = MAX_LOGIN_ATTEMPTS - attempts;
  err.textContent = remaining <= 2
    ? `Email or password is incorrect. ${remaining} attempt(s) remaining before lockout.`
    : 'Email or password is incorrect.';
  err.classList.remove('hidden');
}

async function doSignup() {
  const err = document.getElementById('signupErr');
  err.classList.add('hidden');
  const email = document.getElementById('suEm').value.trim().toLowerCase();
  const pass = document.getElementById('suPs').value;
  const fname = document.getElementById('suFn').value.trim();
  const lname = document.getElementById('suLn').value.trim();
  const phone = document.getElementById('suPh').value.trim();

  if (!fname || !email || !pass) { err.textContent = 'Fill required fields.'; err.classList.remove('hidden'); return; }
  if (pass.length < 6) { err.textContent = 'Password min 6 characters.'; err.classList.remove('hidden'); return; }

  try {
    const uc = await auth.createUserWithEmailAndPassword(email, pass);
    const uid = uc.user.uid;

    let finalRole = 'vendor';
    if (signupRole === 'customer') finalRole = 'customer';
    if (signupRole === 'carrier') finalRole = 'rider';

    const nu = {
      id: uid, email, password: pass,
      role: finalRole,
      fname, lname, phone,
      mapX: 40 + Math.random() * 220,
      mapY: 20 + Math.random() * 160
    };

    if (finalRole !== 'customer' && finalRole !== 'rider') {
      const nm = document.getElementById('suNm').value.trim();
      const cat = document.getElementById('suCat').value;
      if (!nm || !cat) { err.textContent = 'Enter business name and category.'; err.classList.remove('hidden'); return; }
      nu.bizName = nm; nu.category = cat;
      nu.type = cat.startsWith('service') ? 'service' : cat.startsWith('food') ? 'food' : 'shop';
      nu.isLive = false; nu.opensAt = ''; nu.items = []; nu.address = '';
    }

    if (finalRole === 'rider') { nu.isLive = false; nu.earnings = 0; nu.deliveries = 0; }

    await db.collection("users").doc(uid).set(nu);
    toast('LocalMart में स्वागत है! 🎉');
    checkAndRouteUser(uid);
  } catch (error) {
    err.textContent = error.message; err.classList.remove('hidden');
  }
}

async function checkAndRouteUser(uid) {
  DB.currentUser = uid; saveLocalState();
  let u = DB.users.find(x => x.id === uid);
  if (!u && db) { try { const d = await db.collection('users').doc(uid).get(); if (d.exists) { u = {id:d.id,...d.data()}; DB.users.push(u); } } catch(e){} }
  if (!u) { const ae = auth.currentUser?.email; if (ae) { u = DB.users.find(x => x.email === ae); if (u && u.id !== uid) { u.id = uid; if (db) { db.collection('users').doc(uid).set({...u,id:uid}).catch(()=>{}); } } } }
  if (u) loadApp(u);
  else console.warn('Could not route user', uid);
}

function loadApp(user) {
  hideAll();
  if (isAdmin(user) || user.role === 'admin') { show('adminScreen'); initAdmin(); return; }
  if (user.role === 'vendor') { show('dashScreen'); initDash(user); }
  else if (user.role === 'rider') { show('riderScreen'); initRider(user); }
  else { show('custScreen'); initHome(); }
}

function signOut() {
  logAudit('sign_out', DB.currentUser || 'unknown', 'User signed out');
  auth.signOut();
  DB.currentUser = null;
  DB.cart = [];
  saveLocalState();
  window.location.reload();
}

// ─── Firebase Auth State Observer ───
auth.onAuthStateChanged((user) => {
  if (_loginRouting) return;
  if (user) checkAndRouteUser(user.uid);
});

// ─── Role Switcher (Customer ↔ Carrier) ───
function switchRole() {
  const u = getCU(); if (!u) return;
  if (document.getElementById('riderScreen') && !document.getElementById('riderScreen').classList.contains('hidden')) {
    exitCarrierMode();
  } else {
    switchToCarrierMode();
  }
}

// ─── RBAC: Role-Based Access Control ───
function requireRole(requiredRole) {
  const u = getCU();
  if (!u || u.role !== requiredRole) {
    toast('⛔ Unauthorized: ' + requiredRole + ' access required', 'red');
    return false;
  }
  return true;
}
