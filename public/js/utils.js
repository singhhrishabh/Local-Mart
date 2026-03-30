// ═══════════════════════════════════════════════════════
// LocalMart — Utility Functions
// ═══════════════════════════════════════════════════════

/** Show a toast notification */
function toast(msg, type = 'green') {
  const t = document.getElementById('toast');
  document.getElementById('toastMsg').textContent = msg;
  const dot = document.getElementById('toastDot');
  dot.style.background = type === 'green' ? 'var(--gl)' : type === 'red' ? 'var(--rd)' : type === 'blue' ? 'var(--bl)' : 'var(--o)';
  t.classList.add('show');
  setTimeout(() => t.classList.remove('show'), 3200);
}

/** Show/hide helpers */
function show(id) { document.getElementById(id)?.classList.remove('hidden'); }
function hide(id) { document.getElementById(id)?.classList.add('hidden'); }
function hideAll() { ['authScreen', 'dashScreen', 'riderScreen', 'custScreen', 'detailScreen', 'helpScreen'].forEach(hide); }
function closeM(id) { document.getElementById(id)?.classList.add('hidden'); }

/** Close modal on overlay click */
function initModalOverlays() {
  document.querySelectorAll('.mover').forEach(o =>
    o.addEventListener('click', e => { if (e.target === o) o.classList.add('hidden'); })
  );
}

/** Format time string (24h → 12h) */
function fmtTime(t) {
  if (!t) return '';
  const [h, m] = t.split(':').map(Number);
  const am = h < 12 ? 'AM' : 'PM';
  return `${h % 12 || 12}:${String(m).padStart(2, '0')} ${am}`;
}

/** Calculate "Opens in X min/hrs" text */
function opensInText(opensAt) {
  if (!opensAt) return null;
  const [h, m] = opensAt.split(':').map(Number);
  const now = new Date(), opens = new Date();
  opens.setHours(h, m, 0, 0);
  let diff = (opens - now) / 60000;
  if (diff < 0) diff += 1440;
  if (diff <= 0) return null;
  if (diff < 60) return `Opens in ${Math.round(diff)} min`;
  const hrs = Math.floor(diff / 60), mins = Math.round(diff % 60);
  return mins > 0 ? `Opens in ${hrs}h ${mins}m` : `Opens in ${hrs}h`;
}

/** Time-based greeting */
function greet() {
  const h = new Date().getHours();
  return h < 12 ? 'Good morning' : h < 17 ? 'Good afternoon' : 'Good evening';
}

/** Generate order ID */
function orderId() { return '#' + Math.floor(1000 + Math.random() * 9000); }

/** Calculate delivery fee based on subtotal */
function deliveryFeeForOrder(sub) { return sub >= 299 ? 0 : 40; }

/** Calculate carrier pay based on order total */
function perDeliveryPay(o) { return o.total > 499 ? 80 : o.total > 299 ? 60 : 40; }

/** Order status label mapping */
function statusLabel(s) {
  const m = {
    pending: '⏳ Pending',
    vendor_accepted: '✅ Accepted',
    rider_assigned: '🛵 Rider Assigned',
    picked_up: '🛵 Picked Up',
    delivered: '✓ Delivered',
    cancelled: '✕ Cancelled'
  };
  return m[s] || s;
}
