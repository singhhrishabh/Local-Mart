// LocalMart — Package Carrier (Wizard + SMS)

let carrierWizardStep = 0; // 0=not started, 1=destination, 2=matching

function initRider(user) {
  const u = getCU();
  document.getElementById('riderWho').textContent = u.fname + ' ' + u.lname + '\n' + u.email;
  const fromEl = document.getElementById('routeFrom');
  const toEl = document.getElementById('routeTo');
  if (fromEl) fromEl.value = u.routeFrom || '';
  if (toEl) toEl.value = u.routeTo || '';
  updateRouteSub();
  updateRiderLiveUI(); showRPanel('rAvail');

  const extBtn = document.getElementById('exitCarrierBtn');
  if (extBtn) extBtn.style.display = u.role === 'rider' ? 'none' : 'block';

  // Start wizard if no route set
  if (!u.routeFrom || !u.routeTo) carrierWizardStep = 1;
  else carrierWizardStep = 2;

  setInterval(() => { if (getCU()?.id === u.id) refreshRiderPanels(); }, 4000);
}

// ─── Carrier Mode Toggles ───
window.switchToCarrierMode = function() {
  const u = getCU(); if (!u) return;
  hideAll(); show('riderScreen'); initRider(u);
  toast("Carrier Mode 📦", "blue");
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
      db.collection("users").doc(u.id).update({ routeFrom: u.routeFrom || '', routeTo: u.routeTo || '' });
      renderRiderAvail();
    }, 500);
  } else { saveDB(); renderRiderAvail(); }
  updateRouteSub();
  if (u.routeFrom && u.routeTo) carrierWizardStep = 2;
  if (u.isLive) renderRiderAvail();
}

function updateRouteSub() {
  const u = getCU(); if (!u) return;
  const sub = document.getElementById('carrierRouteSub'); if (!sub) return;
  if (u.routeFrom && u.routeTo) {
    sub.textContent = `📍 ${u.routeFrom} → ${u.routeTo} · ${T('step2_match')}`;
    sub.style.color = 'var(--gl)';
  } else {
    sub.textContent = T('step1_dest');
    sub.style.color = 'var(--gy)';
  }
}

function updateRiderLiveUI() {
  const u = getCU(); if (!u) return;
  const tgl = document.getElementById('riderTgl');
  const txt = document.getElementById('riderStatusTxt');
  if (u.isLive) { tgl.className = 'tgl on'; txt.className = 'lb-status lb-live'; txt.innerHTML = '<span class="ldot d-live"></span>' + T('on_route'); }
  else { tgl.className = 'tgl off'; txt.className = 'lb-status lb-off'; txt.innerHTML = '<span class="ldot d-off"></span>' + T('off_duty'); }
}

function toggleRiderLive() {
  const u = getCU();
  const newState = !u.isLive;
  if(db) db.collection("users").doc(u.id).update({ isLive: newState });
  else { u.isLive = newState; saveDB(); updateRiderLiveUI(); }
  logAudit('carrier_toggle', u.id, `${u.fname} → ${newState ? 'on route' : 'off duty'}`);
  toast(newState ? 'You\'re on route! 📦' : 'Off duty', 'green');
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

// ─── Available Packages (with Wizard) ───
function renderRiderAvail() {
  const u = getCU(); if (!u) return;
  const el = document.getElementById('riderAvailList');

  // Wizard Step 1: Not on duty
  if (!u.isLive) {
    el.innerHTML = `<div style="background:var(--lt2);border-radius:var(--r20);padding:22px;text-align:center;">
      <div style="font-size:2rem;margin-bottom:10px">📦</div>
      <div style="font-family:'Syne',sans-serif;font-weight:700;font-size:.95rem;margin-bottom:6px">${T('step1_dest')}</div>
      <div style="font-size:.8rem;color:var(--gy);line-height:1.7">Toggle "On Route" above to start carrying. Set your destination in the sidebar.</div>
    </div>`;
    return;
  }

  // Wizard Step 1: No route set
  if (!u.routeFrom || !u.routeTo) {
    el.innerHTML = `<div style="background:var(--o);color:#fff;border-radius:var(--r20);padding:30px 22px;text-align:center;">
      <div style="font-size:2.5rem;margin-bottom:12px">📍</div>
      <div style="font-family:'Syne',sans-serif;font-weight:800;font-size:1.1rem;margin-bottom:8px">${T('where_going')}</div>
      <div style="font-size:.88rem;opacity:.9;line-height:1.7">Step 1: Enter "From" and "To" in the sidebar to see matching packages.</div>
    </div>`;
    return;
  }

  // Wizard Step 2: Show matching packages
  const available = DB.orders.filter(o =>
    o.customerId !== u.id && o.vendorId !== u.id &&
    ((o.carrierId === u.id && o.status === 'rider_assigned') ||
    (o.status === 'vendor_accepted' && !o.carrierId)) &&
    ((o.vendorAddress || '').toLowerCase().includes(u.routeFrom.toLowerCase()) ||
    (o.address || '').toLowerCase().includes(u.routeTo.toLowerCase()) ||
    (o.vendorAddress || '').toLowerCase().includes(u.routeTo.toLowerCase()) ||
    (o.address || '').toLowerCase().includes(u.routeFrom.toLowerCase()))
  );

  if (!available.length) {
    el.innerHTML = `<div style="background:var(--lt2);border-radius:var(--r20);padding:22px;text-align:center;">
      <div style="font-size:2rem;margin-bottom:10px">🕐</div>
      <div style="font-family:'Syne',sans-serif;font-weight:700;font-size:.95rem;margin-bottom:6px">${T('step2_match')}: None right now</div>
      <div style="font-size:.8rem;color:var(--gy);line-height:1.7">
        Route: <b>${u.routeFrom} → ${u.routeTo}</b><br>Check back soon or adjust your route!
      </div>
    </div>`;
    return;
  }

  el.innerHTML = `<div style="background:linear-gradient(135deg,rgba(244,99,30,.08),rgba(40,160,90,.06));border:1.5px solid var(--lt);border-radius:var(--r20);padding:14px 16px;margin-bottom:14px;">
    <div style="font-family:'Syne',sans-serif;font-weight:800;font-size:.9rem;margin-bottom:4px">${T('step2_match')}</div>
    <div style="font-size:.78rem;color:var(--gy)">📍 ${u.routeFrom} → ${u.routeTo} · ${available.length} package${available.length>1?'s':''} found</div>
  </div>` + available.map(o => `
    <div class="order-card">
      <div class="oc-top">
        <div><div class="oc-id">📦 ${o.id}</div><div class="oc-cust">🏪 From: ${o.vendorName}</div><div class="oc-cust">🏠 To: ${o.address}</div></div>
        <div class="oc-status s-assigned" style="text-align:center">+₹${perDeliveryPay(o)}<br><span style="font-size:.58rem">${T('earn')}</span></div>
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

function acceptRiderOrder(oid) {
  const u = getCU();
  if (db) db.collection("orders").doc(oid).update({ carrierId: u.id, riderId: u.id, status: 'rider_assigned' });
  else { const o = DB.orders.find(x => x.id === oid); if (o) { o.carrierId = u.id; o.riderId = u.id; o.status = 'rider_assigned'; saveDB(); renderRiderAvail(); } }
  // SMS to carrier
  const o = DB.orders.find(x => x.id === oid);
  if (o && u.phone) triggerSMS(u.phone, `Package at ${o.vendorName} (${o.vendorAddress}), drop at ${o.address}, earn ₹${perDeliveryPay(o)}.`);
  logAudit('carrier_accepted', oid, `Carrier ${u.fname} accepted`);
  toast(`📦 Package ${oid} accepted!`, 'green');
}

function markPickedUp(oid) {
  if (db) { db.collection("orders").doc(oid).update({ status: 'picked_up', pickedUpAt: Date.now() }); showRPanel('rActive'); }
  else { const o = DB.orders.find(x => x.id === oid); if (o) { o.status = 'picked_up'; o.pickedUpAt = Date.now(); saveDB(); showRPanel('rActive'); } }
  logAudit('picked_up', oid, 'Carrier picked up package');
  toast(T('picked_up') + ' 🛵', 'orange');
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
      <div style="font-size:.78rem;color:rgba(255,255,255,.5);margin-bottom:12px;">📞 ${o.phone} · 📍 ${o.address}</div>
      <div class="track-map-wrap"><svg id="riderTrackSvg" viewBox="0 0 300 180" width="100%" style="display:block;"></svg></div>
      <div class="oc-actions" style="margin-top:10px;">
        ${o.status === 'rider_assigned' ? `<button class="oa-btn btn-pickup" onclick="markPickedUp('${o.id}')">🛵 Mark Picked Up</button>` : ''}
        ${o.status === 'picked_up' ? `<button class="oa-btn btn-deliver" onclick="markDelivered('${o.id}')">✓ ${T('delivered')}</button>` : ''}
      </div>
      <div style="margin-top:12px;font-size:.8rem;color:rgba(255,255,255,.45)">💰 You earn ₹${perDeliveryPay(o)}</div>
    </div>`;
  drawTrackingMap(o, vendor, u, 'riderTrackSvg');
  if (o.status === 'picked_up') animateRiderDot(o, vendor, u);
}

// ─── Tracking Map ───
let trackInterval = null;

function drawTrackingMap(order, vendor, rider, svgId) {
  const svg = document.getElementById(svgId); if (!svg) return;
  const vx = vendor?.mapX || 100, vy = vendor?.mapY || 80;
  const cx = 150, cy = 140;
  svg.innerHTML = `
    <rect width="300" height="180" fill="#EDE4D8"/>
    <rect x="0" y="70" width="300" height="10" fill="rgba(255,255,255,.65)"/>
    <rect x="0" y="130" width="300" height="8" fill="rgba(255,255,255,.55)"/>
    <rect x="70" y="0" width="9" height="180" fill="rgba(255,255,255,.55)"/>
    <rect x="170" y="0" width="9" height="180" fill="rgba(255,255,255,.65)"/>
    <circle cx="${vx}" cy="${vy}" r="9" fill="var(--o)" stroke="#fff" stroke-width="2"/>
    <text x="${vx}" y="${vy+3.5}" text-anchor="middle" font-size="8" fill="#fff">🏪</text>
    <text x="${vx}" y="${vy-13}" text-anchor="middle" font-size="7" font-family="sans-serif" fill="var(--o)" font-weight="bold">${(vendor?.bizName||'').split(' ')[0]}</text>
    <circle cx="${cx}" cy="${cy}" r="9" fill="var(--g)" stroke="#fff" stroke-width="2"/>
    <text x="${cx}" y="${cy+3.5}" text-anchor="middle" font-size="8" fill="#fff">🏠</text>
    <line x1="${vx}" y1="${vy}" x2="${cx}" y2="${cy}" stroke="var(--o)" stroke-width="1.5" stroke-dasharray="5,4" opacity=".5"/>
    <circle id="riderDot_${svgId}" cx="${rider.mapX}" cy="${rider.mapY}" r="10" fill="var(--b)" stroke="#fff" stroke-width="2"/>
    <text id="riderTxt_${svgId}" x="${rider.mapX}" y="${rider.mapY+4}" text-anchor="middle" font-size="9" fill="#fff">🛵</text>`;
}

function animateRiderDot(order, vendor, rider) {
  if (trackInterval) clearInterval(trackInterval);
  const vx = vendor?.mapX || 100, vy = vendor?.mapY || 80, cx = 150, cy = 140;
  let t = 0;
  trackInterval = setInterval(() => {
    t = Math.min(t + 0.02, 1);
    const nx = vx + (cx - vx) * t, ny = vy + (cy - vy) * t;
    const dot = document.getElementById('riderDot_riderTrackSvg');
    const txt = document.getElementById('riderTxt_riderTrackSvg');
    if (dot) { dot.setAttribute('cx', nx); dot.setAttribute('cy', ny); }
    if (txt) { txt.setAttribute('x', nx); txt.setAttribute('y', ny + 4); }
    if (t >= 1) clearInterval(trackInterval);
  }, 150);
}

function markDelivered(oid) {
  if (trackInterval) clearInterval(trackInterval);
  const u = getCU();
  const o = DB.orders.find(x => x.id === oid); if (!o) return;
  const pay = perDeliveryPay(o);

  if (db) {
    db.collection("orders").doc(oid).update({ status: 'delivered', deliveredAt: Date.now(), cashCollected: true });
    db.collection("users").doc(u.id).update({
      earnings: firebase.firestore.FieldValue.increment(pay),
      deliveries: firebase.firestore.FieldValue.increment(1)
    });
  } else {
    o.status = 'delivered'; o.deliveredAt = Date.now(); o.cashCollected = true;
    u.earnings = (u.earnings || 0) + pay;
    u.deliveries = (u.deliveries || 0) + 1;
    saveDB(); renderRiderActive(); renderRiderHistory(); renderRiderEarnings();
  }
  // SMS confirmation to customer
  if (o.phone) triggerSMS(o.phone, `LocalMart: Your order ${o.id} has been delivered! ₹${o.total} COD. Thank you!`);
  logAudit('delivered', oid, `Carrier ${u.fname} delivered. Cash: ₹${o.total}`);
  toast(`✓ ${T('delivered')}! +₹${pay} 💰`, 'green');
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
        <div class="oc-status s-delivered">✓ ${T('delivered')}</div>
      </div>
      <div class="oc-items">${o.items.map(i => `${i.emoji} ${i.name} ×${i.qty}`).join(' · ')}</div>
      <div class="oc-foot"><div class="oc-addr">📍 ${o.address}</div><div class="oc-total" style="color:var(--gl)">+₹${perDeliveryPay(o)}</div></div>
    </div>`).join('');
}

function renderRiderEarnings() {
  const u = getCU(); if (!u) return;
  const el = document.getElementById('riderEarningsContent');
  const total = u.earnings || 0, count = u.deliveries || 0;
  el.innerHTML = `
    <div style="background:linear-gradient(135deg,rgba(40,160,90,.1),rgba(26,107,60,.05));border-radius:var(--r20);padding:20px;border:1.5px solid var(--lt);margin-bottom:14px;">
      <div style="font-family:'Syne',sans-serif;font-weight:800;font-size:.8rem;color:var(--gy);letter-spacing:.5px;text-transform:uppercase;margin-bottom:14px;">${T('your_earnings')}</div>
      <div style="display:flex;gap:24px;flex-wrap:wrap;">
        <div><div style="font-family:'Syne',sans-serif;font-weight:800;font-size:2rem;color:var(--gl)">₹${total}</div><div style="font-size:.72rem;color:var(--gy);margin-top:2px">Total Earned</div></div>
        <div><div style="font-family:'Syne',sans-serif;font-weight:800;font-size:2rem;color:var(--bl)">${count}</div><div style="font-size:.72rem;color:var(--gy);margin-top:2px">Packages</div></div>
        <div><div style="font-family:'Syne',sans-serif;font-weight:800;font-size:2rem;color:var(--o)">₹${count ? Math.round(total/count) : 0}</div><div style="font-size:.72rem;color:var(--gy);margin-top:2px">Avg/Carry</div></div>
      </div>
    </div>
    <div class="card">
      <div class="card-h">How You Earn</div>
      <div style="font-size:.83rem;line-height:2.2;color:var(--gy);">
        📦 Small (under ₹299): <b style="color:var(--bk)">₹40</b><br>
        📦 Medium (₹300–₹499): <b style="color:var(--bk)">₹60</b><br>
        📦 Large (₹500+): <b style="color:var(--bk)">₹80</b>
      </div>
      <div style="margin-top:14px;padding:12px;background:var(--og);border-radius:var(--r12);font-size:.8rem;line-height:1.6;">
        💵 <b>Cash on Delivery only.</b> No digital payments.
      </div>
    </div>`;
}
