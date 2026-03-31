// ═══════════════════════════════════════════════════════
// LocalMart — App Initialization
// PWA + Offline-First + Hindi/English
// ═══════════════════════════════════════════════════════

// Initialize the application
loadDB();
hideAll();
initModalOverlays();

// Apply saved language
if (getLang() === 'hi') setLang('hi');

if (DB.currentUser) {
  const u = DB.users.find(u => u.id === DB.currentUser);
  if (u) loadApp(u);
  else show('authScreen');
} else {
  show('authScreen');
}

// Sync any pending offline orders on load
setTimeout(() => { if (navigator.onLine) syncPendingOrders(); }, 3000);
