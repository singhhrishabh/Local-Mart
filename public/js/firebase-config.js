// ═══════════════════════════════════════════════════════
// LocalMart — Firebase Configuration
// ═══════════════════════════════════════════════════════

// Using the v8 compatible syntax since we loaded it via CDN in index.html
const firebaseConfig = {
  apiKey: "AIzaSyAaONp5HHyoVooXd-nmEl0qAMXIcARLxas",
  authDomain: "localmart-lucknow.firebaseapp.com",
  projectId: "localmart-lucknow",
  storageBucket: "localmart-lucknow.firebasestorage.app",
  messagingSenderId: "809684409869",
  appId: "1:809684409869:web:fa7d0481ba1152779b7f44"
};

// Initialize Firebase
const app = firebase.initializeApp(firebaseConfig);
const db = firebase.firestore();
const auth = firebase.auth();

console.log("🔥 Firebase linked to localmart-lucknow successfully!");
