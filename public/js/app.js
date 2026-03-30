// ═══════════════════════════════════════════════════════
// LocalMart — App Initialization
// ═══════════════════════════════════════════════════════

// Initialize the application
loadDB();
hideAll();
initModalOverlays();

if (DB.currentUser) {
  const u = DB.users.find(u => u.id === DB.currentUser);
  if (u) loadApp(u);
  else show('authScreen');
} else {
  show('authScreen');
}
