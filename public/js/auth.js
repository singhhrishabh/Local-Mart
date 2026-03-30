// ═══════════════════════════════════════════════════════
// LocalMart — Authentication (Firebase Auth)
// ═══════════════════════════════════════════════════════

let signupRole = 'vendor';

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

/** Quick login from demo buttons */
function ql(email, pass) {
  document.getElementById('liEmail').value = email;
  document.getElementById('liPass').value = pass;
  doLogin();
}

async function doLogin() {
  const email = document.getElementById('liEmail').value.trim().toLowerCase();
  const pass = document.getElementById('liPass').value;
  const err = document.getElementById('loginErr');
  err.classList.add('hidden');

  if (!email || !pass) { err.textContent = 'Enter email and password.'; err.classList.remove('hidden'); return; }

  try {
    let authUser = await auth.signInWithEmailAndPassword(email, pass);
    checkAndRouteUser(authUser.user.uid);
  } catch (error) {
    // If login fails (user doesn't exist, invalid credentials, etc.), check if they exist in our DEMOS Firestore array
    try {
      const userRef = await db.collection("users").where("email", "==", email).where("password", "==", pass).get();
      if (!userRef.empty) {
        let udata = userRef.docs[0].data();
        let oldDocId = userRef.docs[0].id;
        try {
          let newAuth = await auth.createUserWithEmailAndPassword(email, pass);
          // Migrate old Firestore doc to the new Auth UID
          if (oldDocId !== newAuth.user.uid) {
            await db.collection("users").doc(newAuth.user.uid).set(udata);
            await db.collection("users").doc(oldDocId).delete();
          }
          await db.collection("users").doc(newAuth.user.uid).update({ id: newAuth.user.uid });
          checkAndRouteUser(newAuth.user.uid);
          return; // Stop here, login successful
        } catch(signupErr) {
          console.error("Auto-signup failed:", signupErr);
        }
      }
    } catch(dbErr) {
      console.error("Firestore lookup failed during login:", dbErr);
    }
    
    // If we're here, it means auto-signup didn't occur or failed
    console.error("Login failed:", error);
    err.textContent = 'Email or password is incorrect.'; 
    err.classList.remove('hidden');
  }
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
    if (signupRole === 'carrier') finalRole = 'rider'; // The app maps carrier to rider under the hood

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
    
    toast('Welcome to LocalMart! 🎉'); 
    checkAndRouteUser(uid);
  } catch (error) {
    err.textContent = error.message;
    err.classList.remove('hidden');
  }
}

async function checkAndRouteUser(uid) {
  DB.currentUser = uid;
  saveLocalState();
  let user = DB.users.find(u => u.id === uid);
  // Race condition: if login completes before initial onSnapshot finishes, explicitly fetch user
  if (!user && db) {
    try {
      const doc = await db.collection('users').doc(uid).get();
      if (doc.exists) user = { id: doc.id, ...doc.data() };
    } catch(e) {}
  }
  if (user) loadApp(user);
  else console.error("Could not route user, user data not found for UID:", uid);
}

function loadApp(user) {
  hideAll();
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
}

// ─── Firebase Auth State Observer ───
auth.onAuthStateChanged((user) => {
  if (user) {
    if (DB.users.length) checkAndRouteUser(user.uid);
    else {
      // If DB array hasn't loaded yet, try explicitly
      checkAndRouteUser(user.uid);
    }
  }
});
