// LocalMart — Auth (Dual Login + Admin)

let signupRole = 'vendor';
let loginMode = 'email'; // 'email' or 'phone'
let _loginRouting = false; // guard: prevents onAuthStateChanged from double-routing

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

/* Phone + OTP login (simulated for demo — real OTP needs Firebase Blaze plan) */
async function sendOTP() {
  const phone = document.getElementById('liPhone').value.trim();
  const err = document.getElementById('loginErr');
  if (!phone || phone.length < 10) { err.textContent = 'Enter valid phone number.'; err.classList.remove('hidden'); return; }
  // Simulated OTP — in production, use firebase.auth().signInWithPhoneNumber()
  document.getElementById('otpSection').classList.remove('hidden');
  toast('📱 OTP sent to ' + phone + ' (Demo: use 123456)', 'blue');
}

async function verifyOTP() {
  const phone = document.getElementById('liPhone').value.trim();
  const otp = document.getElementById('liOTP').value.trim();
  const err = document.getElementById('loginErr');
  if (otp !== '123456') { err.textContent = 'Invalid OTP. Demo OTP: 123456'; err.classList.remove('hidden'); return; }
  // Find user by phone or create new one
  try {
    const snap = await db.collection('users').where('phone', '==', phone).limit(1).get();
    if (!snap.empty) {
      const udata = snap.docs[0].data();
      // Try to sign in with stored email/pass, or create a temp auth
      try {
        const ac = await auth.signInWithEmailAndPassword(udata.email, udata.password);
        checkAndRouteUser(ac.user.uid);
      } catch(e) {
        try {
          const ac = await auth.createUserWithEmailAndPassword(udata.email, udata.password);
          await db.collection('users').doc(ac.user.uid).set({...udata, id: ac.user.uid});
          if (snap.docs[0].id !== ac.user.uid) await db.collection('users').doc(snap.docs[0].id).delete();
          checkAndRouteUser(ac.user.uid);
        } catch(e2) { err.textContent = 'Login failed: ' + e2.message; err.classList.remove('hidden'); }
      }
    } else {
      err.textContent = 'No account found with this phone. Please sign up first.';
      err.classList.remove('hidden');
    }
  } catch(e) { err.textContent = e.message; err.classList.remove('hidden'); }
}

async function doLogin() {
  const email = document.getElementById('liEmail').value.trim().toLowerCase();
  const pass = document.getElementById('liPass').value;
  const err = document.getElementById('loginErr');
  err.classList.add('hidden');
  if (!email || !pass) { err.textContent = 'Enter email and password.'; err.classList.remove('hidden'); return; }
  function directRoute(uid, d) { _loginRouting=true; DB.currentUser=uid; saveLocalState(); if(!DB.users.find(u=>u.id===uid)) DB.users.push({...d,id:uid}); loadApp({...d,id:uid}); }
  try {
    const ac = await auth.signInWithEmailAndPassword(email, pass), uid = ac.user.uid;
    let ud = DB.users.find(u=>u.id===uid);
    if (!ud && db) { const d = await db.collection('users').doc(uid).get(); if(d.exists) ud={id:uid,...d.data()}; }
    if (!ud) ud = DB.users.find(u=>u.email===email);
    if (ud) { directRoute(uid,ud); return; }
    if (email==='admin@localmart.in') { directRoute(uid,{email,role:'admin',fname:'Super',lname:'Admin'}); return; }
    checkAndRouteUser(uid); return;
  } catch(e1) {}
  try {
    const snap = await db.collection("users").where("email","==",email).limit(1).get();
    if (!snap.empty) {
      const ud = snap.docs[0].data(), oid = snap.docs[0].id;
      if (ud.password !== pass) { err.textContent='Email or password is incorrect.'; err.classList.remove('hidden'); return; }
      try {
        const na = await auth.createUserWithEmailAndPassword(email,pass), nid = na.user.uid;
        if (oid!==nid) { await db.collection("users").doc(nid).set({...ud,id:nid}); await db.collection("users").doc(oid).delete().catch(()=>{}); }
        directRoute(nid,ud); return;
      } catch(e2) {
        if (e2.code==='auth/email-already-in-use') { try { const ra=await auth.signInWithEmailAndPassword(email,ud.password); directRoute(ra.user.uid,ud); return; } catch(e3){} }
      }
    }
  } catch(e) {}
  err.textContent = 'Email or password is incorrect.'; err.classList.remove('hidden');
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

    if (finalRole === 'rider') {
      nu.isLive = false; nu.earnings = 0; nu.deliveries = 0;
    }

    await db.collection("users").doc(uid).set(nu);
    toast('LocalMart में स्वागत है! 🎉');
    checkAndRouteUser(uid);
  } catch (error) {
    err.textContent = error.message;
    err.classList.remove('hidden');
  }
}

async function checkAndRouteUser(uid) {
  DB.currentUser = uid; saveLocalState();
  let u = DB.users.find(x => x.id === uid);
  if (!u && db) { try { const d = await db.collection('users').doc(uid).get(); if (d.exists) { u = {id:d.id,...d.data()}; DB.users.push(u); } } catch(e){} }
  if (!u) { const ae = auth.currentUser?.email; if (ae) { u = DB.users.find(x => x.email === ae); if (u && u.id !== uid) { u.id = uid; if (db) { db.collection('users').doc(uid).set({...u,id:uid}); db.collection('users').doc(u.id).delete().catch(()=>{}); } } } }
  if (u) loadApp(u);
}

function loadApp(user) {
  hideAll();
  // Check admin: either by email or role
  if (isAdmin(user) || user.role === 'admin') { show('adminScreen'); initAdmin(); return; }
  if (user.role === 'vendor') { show('dashScreen'); initDash(user); }
  else if (user.role === 'rider') { show('riderScreen'); initRider(user); }
  else { show('custScreen'); initHome(); }
}

function signOut() {
  auth.signOut();
  DB.currentUser = null;
  DB.cart = [];
  saveLocalState();
  hideAll();
  show('authScreen');
  logAudit('sign_out', DB.currentUser || 'unknown', 'User signed out');
}

// ─── Firebase Auth State Observer ───
auth.onAuthStateChanged((user) => {
  if (_loginRouting) return; // login is handling routing directly
  if (user) {
    checkAndRouteUser(user.uid);
  }
});

// ─── Role Switcher (Customer ↔ Carrier) ───
function switchRole() {
  const u = getCU(); if (!u) return;
  if (document.getElementById('riderScreen') && !document.getElementById('riderScreen').classList.contains('hidden')) {
    // Currently carrier → switch to customer
    exitCarrierMode();
  } else {
    // Switch to carrier
    switchToCarrierMode();
  }
}
