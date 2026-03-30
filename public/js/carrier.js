// ═══════════════════════════════════════════════════════
// LocalMart — Package Carrier Dashboard
// ═══════════════════════════════════════════════════════

function initRider(user) {
  const u = getCU();
  document.getElementById('riderWho').textContent = u.fname + ' ' + u.lname + '\n' + u.email;
  const fromEl = document.getElementById('routeFrom');
  const toEl = document.getElementById('routeTo');
  if (fromEl) fromEl.value = u.routeFrom || '';
  if (toEl) toEl.value = u.routeTo || '';
  updateRouteSub();
  updateRiderLiveUI(); showRPanel('rAvail');
  
  // Show Exit button only if they are not naturally a rider
  const extBtn = document.getElementById('exitCarrierBtn');
  if (extBtn) extBtn.style.display = u.role === 'rider' ? 'none' : 'block';

  setInterval(() => { if (getCU()?.id === u.id) refreshRiderPanels(); }, 4000);
}

// ─── Carrier Mode Toggles ───
window.switchToCarrierMode = function() {
  const u = getCU(); if (!u) return;
  hideAll();
  show('riderScreen');
  initRider(u);
  toast("Switched to Carrier Mode 📦", "blue");
};

window.exitCarrierMode = function() {
  const u = getCU(); if (!u) return;
  hideAll();
  if (u.role === 'vendor') { show('dashScreen'); initDash(u); }
  else { show('custScreen'); initHome(); }
};

let routeDebounce;
function saveRoute() {
  const u = getCU(); if (!u) return;
  const fromEl = document.getElementById('routeFrom');
  const toEl = document.getElementById('routeTo');
  if (fromEl) u.routeFrom = fromEl.value;
  if (toEl) u.routeTo = toEl.value;
  
  if (db) {
    clearTimeout(routeDebounce);
    routeDebounce = setTimeout(() => {
      db.collection("users").doc(u.id).update({
        routeFrom: u.routeFrom || '',
        routeTo: u.routeTo || ''
      });
      renderRiderAvail();
    }, 500);
  } else {
    saveDB(); 
    renderRiderAvail();
  }
  updateRouteSub();
  if (u.isLive) renderRiderAvail();
}

function updateRouteSub() {
  const u = getCU(); if (!u) return;
  const sub = document.getElementById('carrierRouteSub'); if (!sub) return;
  if (u.routeFrom && u.routeTo) {
    sub.textContent = `📍 ${u.routeFrom} → ${u.routeTo} · Showing packages on your path`;
    sub.style.color = 'var(--gl)';
  } else {
    sub.textContent = 'Set your route in the sidebar to see packages on your path';
    sub.style.color = 'var(--gy)';
  }
}

function updateRiderLiveUI() {
  const u = getCU(); if (!u) return;
  const tgl = document.getElementById('riderTgl');
  const txt = document.getElementById('riderStatusTxt');
  if (u.isLive) { tgl.className = 'tgl on'; txt.className = 'lb-status lb-live'; txt.innerHTML = '<span class="ldot d-live"></span>On Route'; }
  else { tgl.className = 'tgl off'; txt.className = 'lb-status lb-off'; txt.innerHTML = '<span class="ldot d-off"></span>Off Duty'; }
}

function toggleRiderLive() {
  const u = getCU();
  const newState = !u.isLive;
  if(db) {
    db.collection("users").doc(u.id).update({ isLive: newState });
  } else {
    u.isLive = newState; saveDB(); updateRiderLiveUI();
  }
  toast(newState ? 'You\'re on route! Packages will be offered to you 📦' : 'Marked off duty', 'green');
}

function refreshRiderPanels() {
  const panel = document.querySelector('.sbn.act[data-rp]')?.dataset.rp;
  if (panel === 'rAvail') renderRiderAvail();
  if (panel === 'rActive') renderRiderActive();
  const ab = document.getElementById('activeDelivBadge');
  const abm = document.getElementById('activeDelivBadgeMob');
  const u = getCU(); if (!u) return;
  const active = DB.orders.find(o => o.riderId === u.id && ['rider_assigned', 'picked_up'].includes(o.status));
  if (ab) ab.style.display = active ? 'flex' : 'none';
  if (abm) abm.style.display = active ? 'flex' : 'none';
}

function showRPanel(panel) {
  ['rAvail', 'rActive', 'rHistory', 'rEarnings'].forEach(p => {
    document.getElementById('panel' + p.charAt(0).toUpperCase() + p.slice(1))?.classList.toggle('hidden', p !== panel);
  });
  document.querySelectorAll('.sbn[data-rp]').forEach(b => b.classList.toggle('act', b.dataset.rp === panel));
  document.querySelectorAll('#riderScreen .bni').forEach(b => b.classList.remove('act'));
  if (panel === 'rAvail') renderRiderAvail();
  if (panel === 'rActive') renderRiderActive();
  if (panel === 'rHistory') renderRiderHistory();
  if (panel === 'rEarnings') renderRiderEarnings();
}

function rMobNav(panel, btn) {
  document.querySelectorAll('#riderScreen .bni').forEach(b => b.classList.remove('act'));
  btn.classList.add('act'); showRPanel(panel);
}

// ─── Available Packages ───
function renderRiderAvail() {
  const u = getCU(); if (!u) return;
  const el = document.getElementById('riderAvailList');
  if (!u.isLive) {
    el.innerHTML = `<div style="background:var(--lt2);border-radius:var(--r20);padding:22px;text-align:center;">
      <div style="font-size:2rem;margin-bottom:10px">📦</div>
      <div style="font-family:'Syne',sans-serif;font-weight:700;font-size:.95rem;margin-bottom:6px">Toggle "On Route" to start carrying</div>
      <div style="font-size:.8rem;color:var(--gy);line-height:1.7">When you're heading out, flip the switch above.<br>Packages near your route will appear here automatically.</div>
    </div>`;
    return;
  }
  
  if (!u.routeFrom || !u.routeTo) {
    el.innerHTML = `<div style="background:var(--o);color:#fff;border-radius:var(--r20);padding:30px 22px;text-align:center;">
      <div style="font-size:2.5rem;margin-bottom:12px">📍</div>
      <div style="font-family:'Syne',sans-serif;font-weight:800;font-size:1.1rem;margin-bottom:8px">Where are you heading?</div>
      <div style="font-size:.88rem;opacity:.9;line-height:1.7">Enter your current location and destination in the side panel (or top) to see available packages along your route.</div>
    </div>`;
    return;
  }

  const available = DB.orders.filter(o =>
    o.customerId !== u.id &&
    o.vendorId !== u.id &&
    ((o.carrierId === u.id && o.status === 'rider_assigned') ||
    (o.status === 'vendor_accepted' && !o.carrierId)) &&
    (
      // Simple text matching for route locations
      (o.vendorAddress || '').toLowerCase().includes(u.routeFrom.toLowerCase()) || 
      (o.address || '').toLowerCase().includes(u.routeTo.toLowerCase()) ||
      (o.vendorAddress || '').toLowerCase().includes(u.routeTo.toLowerCase()) || 
      (o.address || '').toLowerCase().includes(u.routeFrom.toLowerCase())
    )
  );
  if (!available.length) {
    el.innerHTML = `<div style="background:var(--lt2);border-radius:var(--r20);padding:22px;text-align:center;">
      <div style="font-size:2rem;margin-bottom:10px">🕐</div>
      <div style="font-family:'Syne',sans-serif;font-weight:700;font-size:.95rem;margin-bottom:6px">No packages on this route right now</div>
      <div style="font-size:.8rem;color:var(--gy);line-height:1.7">
        Your route: <b>${u.routeFrom} → ${u.routeTo}</b><br>
        Check back in a few minutes or adjust your route!
      </div>
    </div>`;
    return;
  }
  el.innerHTML = available.map(o => `
    <div class="order-card">
      <div class="oc-top">
        <div>
          <div class="oc-id">📦 Package ${o.id}</div>
          <div class="oc-cust">🏪 From: ${o.vendorName}</div>
          <div class="oc-cust">🏠 To: ${o.address}</div>
        </div>
        <div class="oc-status s-assigned" style="text-align:center">+₹${perDeliveryPay(o)}<br><span style="font-size:.58rem">earn</span></div>
      </div>
      <div class="oc-items">${o.items.map(i => `${i.emoji} ${i.name} ×${i.qty}`).join(' · ')}</div>
      <div class="oc-foot">
        <div class="oc-addr">🏪 Pickup: ${o.vendorAddress}</div>
        <div class="oc-actions">
          ${o.carrierId === u.id ? `<button class="oa-btn btn-pickup" onclick="markPickedUp('${o.id}')">✋ Picked Up</button>`
            : `<button class="oa-btn btn-accept" onclick="acceptRiderOrder('${o.id}')">I'll carry this</button>`}
        </div>
      </div>
    </div>`).join('');
}

function acceptRiderOrder(orderId) {
  const u = getCU();
  if (db) {
    db.collection("orders").doc(orderId).update({ carrierId: u.id, riderId: u.id, status: 'rider_assigned' });
  } else {
    const o = DB.orders.find(x => x.id === orderId); if (o) { o.carrierId = u.id; o.riderId = u.id; o.status = 'rider_assigned'; saveDB(); renderRiderAvail(); }
  }
  toast(`📦 Package ${orderId} accepted! Pick up from store`, 'green');
}

function markPickedUp(orderId) {
  if (db) {
    db.collection("orders").doc(orderId).update({ status: 'picked_up', pickedUpAt: Date.now() });
    showRPanel('rActive');
  } else {
    const o = DB.orders.find(x => x.id === orderId); if (o) { o.status = 'picked_up'; o.pickedUpAt = Date.now(); saveDB(); showRPanel('rActive'); }
  }
  toast('Picked up! Now deliver to customer 🏠', 'orange');
}

// ─── Active Carry ───
function renderRiderActive() {
  const u = getCU(); if (!u) return;
  const el = document.getElementById('riderActiveContent');
  const o = DB.orders.find(x => x.riderId === u.id && ['rider_assigned', 'picked_up'].includes(x.status));
  if (!o) { el.innerHTML = `<div style="text-align:center;padding:50px;color:rgba(255,255,255,.3)">No active delivery right now.</div>`; return; }
  const vendor = DB.users.find(v => v.id === o.vendorId);
  el.innerHTML = `
    <div class="order-card" style="border-color:var(--o)">
      <div class="oc-top">
        <div><div class="oc-id">Order ${o.id}</div><div class="oc-cust">📦 ${o.vendorName} → 🏠 ${o.customerName}</div></div>
        <div class="oc-status s-pickedup">${o.status === 'picked_up' ? '🛵 En Route' : '📦 Pickup'}</div>
      </div>
      <div class="oc-items">${o.items.map(i => `${i.emoji} ${i.name} ×${i.qty}`).join(' · ')}</div>
      <div style="font-size:.78rem;color:rgba(255,255,255,.5);margin-bottom:12px;">📞 Customer: ${o.phone} · 📍 ${o.address}</div>
      <div class="track-map-wrap"><svg id="riderTrackSvg" viewBox="0 0 300 180" width="100%" style="display:block;"></svg></div>
      <div class="oc-actions" style="margin-top:10px;">
        ${o.status === 'rider_assigned' ? `<button class="oa-btn btn-pickup" onclick="markPickedUp('${o.id}')">🛵 Mark Picked Up</button>` : ''}
        ${o.status === 'picked_up' ? `<button class="oa-btn btn-deliver" onclick="markDelivered('${o.id}')">✓ Mark Delivered</button>` : ''}
      </div>
      <div style="margin-top:12px;font-size:.8rem;color:rgba(255,255,255,.45)">💰 You earn ₹${perDeliveryPay(o)} for this delivery</div>
    </div>`;
  drawTrackingMap(o, vendor, u, 'riderTrackSvg');
  if (o.status === 'picked_up') animateRiderDot(o, vendor, u);
}

// ─── Tracking Map ───
let trackInterval = null;

function drawTrackingMap(order, vendor, rider, svgId) {
  const svg = document.getElementById(svgId); if (!svg) return;
  const vx = vendor?.mapX || 100, vy = vendor?.mapY || 80;
  const rx = rider.mapX, ry = rider.mapY;
  const cx = 150, cy = 140;
  svg.innerHTML = `
    <rect width="300" height="180" fill="#EDE4D8"/>
    <rect x="0" y="70" width="300" height="10" fill="rgba(255,255,255,.65)"/>
    <rect x="0" y="130" width="300" height="8" fill="rgba(255,255,255,.55)"/>
    <rect x="70" y="0" width="9" height="180" fill="rgba(255,255,255,.55)"/>
    <rect x="170" y="0" width="9" height="180" fill="rgba(255,255,255,.65)"/>
    <circle cx="${vx}" cy="${vy}" r="9" fill="var(--o)" stroke="#fff" stroke-width="2"/>
    <text x="${vx}" y="${vy + 3.5}" text-anchor="middle" font-size="8" fill="#fff">🏪</text>
    <text x="${vx}" y="${vy - 13}" text-anchor="middle" font-size="7" font-family="sans-serif" fill="var(--o)" font-weight="bold">${(vendor?.bizName || '').split(' ')[0]}</text>
    <circle cx="${cx}" cy="${cy}" r="9" fill="var(--g)" stroke="#fff" stroke-width="2"/>
    <text x="${cx}" y="${cy + 3.5}" text-anchor="middle" font-size="8" fill="#fff">🏠</text>
    <text x="${cx}" y="${cy - 13}" text-anchor="middle" font-size="7" font-family="sans-serif" fill="var(--g)" font-weight="bold">Customer</text>
    <line x1="${vx}" y1="${vy}" x2="${cx}" y2="${cy}" stroke="var(--o)" stroke-width="1.5" stroke-dasharray="5,4" opacity=".5"/>
    <circle id="riderDot_${svgId}" cx="${rx}" cy="${ry}" r="10" fill="var(--b)" stroke="#fff" stroke-width="2"/>
    <text id="riderTxt_${svgId}" x="${rx}" y="${ry + 4}" text-anchor="middle" font-size="9" fill="#fff">🛵</text>`;
}

function animateRiderDot(order, vendor, rider) {
  if (trackInterval) clearInterval(trackInterval);
  const svgId = 'riderTrackSvg';
  const vx = vendor?.mapX || 100, vy = vendor?.mapY || 80;
  const cx = 150, cy = 140;
  let t = 0;
  trackInterval = setInterval(() => {
    t = Math.min(t + 0.02, 1);
    const nx = vx + (cx - vx) * t;
    const ny = vy + (cy - vy) * t;
    const dot = document.getElementById('riderDot_' + svgId);
    const txt = document.getElementById('riderTxt_' + svgId);
    if (dot) { dot.setAttribute('cx', nx); dot.setAttribute('cy', ny); }
    if (txt) { txt.setAttribute('x', nx); txt.setAttribute('y', ny + 4); }
    if (t >= 1) clearInterval(trackInterval);
  }, 150);
}

function markDelivered(orderId) {
  if (trackInterval) clearInterval(trackInterval);
  const u = getCU();
  const o = DB.orders.find(x => x.id === orderId); if (!o) return;
  const pay = perDeliveryPay(o);
  
  if (db) {
    db.collection("orders").doc(orderId).update({ status: 'delivered', deliveredAt: Date.now() });
    db.collection("users").doc(u.id).update({
      earnings: firebase.firestore.FieldValue.increment(pay),
      deliveries: firebase.firestore.FieldValue.increment(1)
    });
  } else {
    o.status = 'delivered'; o.deliveredAt = Date.now();
    u.earnings = (u.earnings || 0) + pay;
    u.deliveries = (u.deliveries || 0) + 1;
    saveDB(); renderRiderActive(); renderRiderHistory(); renderRiderEarnings();
  }
  toast(`✓ Delivered! You earned ₹${pay} 💰`, 'green');
}

// ─── History & Earnings ───
function renderRiderHistory() {
  const u = getCU(); if (!u) return;
  const el = document.getElementById('riderHistoryList');
  const hist = DB.orders.filter(o => o.riderId === u.id && o.status === 'delivered');
  if (!hist.length) { el.innerHTML = `<div style="text-align:center;padding:50px;color:rgba(255,255,255,.3)">No deliveries yet.</div>`; return; }
  el.innerHTML = hist.map(o => `
    <div class="order-card">
      <div class="oc-top">
        <div><div class="oc-id">Order ${o.id}</div><div class="oc-cust">${o.vendorName} → ${o.customerName}</div></div>
        <div class="oc-status s-delivered">✓ Delivered</div>
      </div>
      <div class="oc-items">${o.items.map(i => `${i.emoji} ${i.name} ×${i.qty}`).join(' · ')}</div>
      <div class="oc-foot"><div class="oc-addr">📍 ${o.address}</div><div class="oc-total" style="color:var(--gl)">+₹${perDeliveryPay(o)}</div></div>
    </div>`).join('');
}

function renderRiderEarnings() {
  const u = getCU(); if (!u) return;
  const el = document.getElementById('riderEarningsContent');
  const total = u.earnings || 0;
  const count = u.deliveries || 0;
  el.innerHTML = `
    <div style="background:linear-gradient(135deg,rgba(40,160,90,.1),rgba(26,107,60,.05));border-radius:var(--r20);padding:20px;border:1.5px solid var(--lt);margin-bottom:14px;">
      <div style="font-family:'Syne',sans-serif;font-weight:800;font-size:.8rem;color:var(--gy);letter-spacing:.5px;text-transform:uppercase;margin-bottom:14px;">Your Carry Earnings</div>
      <div style="display:flex;gap:24px;flex-wrap:wrap;">
        <div><div style="font-family:'Syne',sans-serif;font-weight:800;font-size:2rem;color:var(--gl)">₹${total}</div><div style="font-size:.72rem;color:var(--gy);margin-top:2px">Total Earned</div></div>
        <div><div style="font-family:'Syne',sans-serif;font-weight:800;font-size:2rem;color:var(--bl)">${count}</div><div style="font-size:.72rem;color:var(--gy);margin-top:2px">Packages Carried</div></div>
        <div><div style="font-family:'Syne',sans-serif;font-weight:800;font-size:2rem;color:var(--o)">₹${count ? Math.round(total / count) : 0}</div><div style="font-size:.72rem;color:var(--gy);margin-top:2px">Avg per Carry</div></div>
      </div>
    </div>
    <div class="card">
      <div class="card-h">How You Earn</div>
      <div style="font-size:.83rem;line-height:2.2;color:var(--gy);">
        📦 Small package (order under ₹299): <b style="color:var(--bk)">₹40</b><br>
        📦 Medium package (₹300–₹499): <b style="color:var(--bk)">₹60</b><br>
        📦 Large package (₹500+): <b style="color:var(--bk)">₹80</b>
      </div>
      <div style="margin-top:14px;padding:12px;background:var(--og);border-radius:var(--r12);font-size:.8rem;line-height:1.6;">
        💸 <b>Weekly payout</b> to your UPI / bank account.<br>
        No minimum deliveries. No target. Earn on your own route.
      </div>
    </div>
    <div class="card" style="margin-top:12px;">
      <div class="card-h" style="font-size:.88rem;">My Route Today</div>
      <div style="font-size:.84rem;color:var(--gy)">
        ${u.routeFrom && u.routeTo ? `<b style="color:var(--bk)">${u.routeFrom}</b> → <b style="color:var(--bk)">${u.routeTo}</b>` : 'No route set — go to Available Packages to set your route.'}
      </div>
    </div>`;
}
