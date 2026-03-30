// ═══════════════════════════════════════════════════════
// LocalMart — Customer Home, Detail, Cart, Checkout
// ═══════════════════════════════════════════════════════

let activeSection = 'all';
let currentVendorId = null;

// ─── Section Navigation ───
function setSection(s) {
  activeSection = s;
  document.querySelectorAll('.stab').forEach((b, i) =>
    b.classList.toggle('act', ['all', 'shops', 'food', 'services', 'myorders'][i] === s)
  );
  renderHome();
}

function setCustTab(s, btn) {
  setSection(s);
  document.querySelectorAll('.bnav .bni').forEach(b => b.classList.remove('act'));
  btn?.classList.add('act');
}

function initHome() { renderHome(); }

// ─── Home Grid ───
function renderHome() {
  const search = (document.getElementById('cSearch')?.value || '').toLowerCase();
  if (activeSection === 'myorders') { renderMyOrders(); return; }
  if (activeSection === 'services') { renderServicesPage(search); return; }

  let vendors = getVendors();
  if (activeSection === 'shops') vendors = vendors.filter(v => v.type === 'shop');
  else if (activeSection === 'food') vendors = vendors.filter(v => v.type === 'food');
  if (activeSection === 'all') vendors = vendors.filter(v => v.type !== 'service');
  if (search) vendors = vendors.filter(v => v.bizName?.toLowerCase().includes(search) || (v.items || []).some(i => i.name.toLowerCase().includes(search)));

  document.getElementById('liveCnt').textContent = getLive().filter(v => v.type !== 'service').length + ' Live';
  renderMapSVG(); renderMapList();

  const lbl = search ? `RESULTS (${vendors.length})` : activeSection === 'shops' ? 'SHOPS NEAR YOU' : activeSection === 'food' ? 'FOOD & SNACKS' : 'ALL NEARBY';
  document.getElementById('gridTitle').textContent = lbl;
  const grid = document.getElementById('mainGrid');
  if (!vendors.length) { grid.innerHTML = `<div style="text-align:center;padding:50px;color:var(--gy);grid-column:1/-1">😔 Nothing found right now</div>`; return; }

  const bgs = ['#FFF3E0', '#F3E5F5', '#E8F5E9', '#FFF8E1', '#FCE4EC', '#E3F2FD', '#EDE7F6', '#E0F2F1', '#FFF9C4'];
  const live = vendors.filter(v => v.isLive);
  const closed = vendors.filter(v => !v.isLive);
  grid.innerHTML = [...live, ...closed].map((v, idx) => {
    const cat = v.category?.split('|')[1] || '';
    const emoji = cat.split(' ')[0] || '🏪';
    const bg = bgs[idx % bgs.length];
    const isF = v.type === 'food';
    const ot = opensInText(v.opensAt);
    return `<div class="scard ${v.isLive ? '' : 'closed-card'}" onclick="${v.isLive ? `openDetail('${v.id}')` : `closedToast('${v.bizName}','${v.opensAt}')`}">
      <div class="sc-banner" style="background:${bg}">
        <span>${emoji}</span>
        ${v.isLive ? `<div class="sc-live-tag ${isF ? 'lt-food' : 'lt-shop'}"><div class="sc-ld"></div>Open</div>` : `<div class="closed-tag">Closed</div>`}
        ${!v.isLive && ot ? `<div class="opens-bub">⏰ ${ot}</div>` : ''}
        ${!v.isLive && v.opensAt && !ot ? `<div class="opens-bub">Opens ${fmtTime(v.opensAt)}</div>` : ''}
      </div>
      <div class="sc-body">
        <div class="sc-nm">${v.bizName}</div>
        <div class="sc-meta"><span>📍 ${(0.3 + Math.random() * 1.8).toFixed(1)}km</span><span>· ${cat}</span></div>
        <div class="sc-badge ${v.isLive ? (isF ? 'sb-food' : 'sb-shop') : 'sb-closed'}">${v.isLive ? (v.items || []).filter(i => i.avail).length + ' items' : 'Tap to browse'}</div>
      </div>
    </div>`;
  }).join('');
}

// ─── Services Page ───
function renderServicesPage(search = '') {
  document.getElementById('gridTitle').textContent = 'HOME SERVICES NEAR YOU';
  document.getElementById('liveCnt').textContent = getLive().filter(v => v.type === 'service').length + ' Available';
  renderMapSVG(true); renderMapList(true);
  const svcVendors = getVendors().filter(v => v.type === 'service' && (!search || v.bizName?.toLowerCase().includes(search)));
  const bgs = ['#E3F2FD', '#EDE7F6', '#E8F5E9', '#FFF8E1', '#FCE4EC'];
  const grid = document.getElementById('mainGrid');
  const liveS = svcVendors.filter(v => v.isLive);
  const closedS = svcVendors.filter(v => !v.isLive);
  grid.innerHTML = [...liveS, ...closedS].map((v, i) => {
    const cat = v.category?.split('|')[1] || '';
    const emoji = cat.split(' ')[0] || '🔧';
    const ot = opensInText(v.opensAt);
    return `<div class="scard ${v.isLive ? '' : 'closed-card'}" onclick="${v.isLive ? `openDetail('${v.id}')` : `closedToast('${v.bizName}','${v.opensAt}')`}">
      <div class="sc-banner" style="background:${bgs[i % bgs.length]}">
        <span>${emoji}</span>
        ${v.isLive ? `<div class="sc-live-tag lt-svc"><div class="sc-ld"></div>Available</div>` : `<div class="closed-tag">Unavailable</div>`}
        ${!v.isLive && ot ? `<div class="opens-bub">⏰ ${ot}</div>` : ''}
      </div>
      <div class="sc-body">
        <div class="sc-nm">${v.bizName}</div>
        <div class="sc-meta"><span>📍 ${(0.3 + Math.random() * 1.5).toFixed(1)}km</span></div>
        <div class="sc-badge ${v.isLive ? 'sb-svc' : 'sb-closed'}">${v.isLive ? (v.items || []).filter(i => i.avail).length + ' services' : 'Unavailable'}</div>
      </div>
    </div>`;
  }).join('');
}

// ─── My Orders ───
function renderMyOrders() {
  document.getElementById('gridTitle').textContent = 'MY ORDERS & BOOKINGS';
  const u = getCU(); if (!u) return;
  const ts = dt => dt && dt.toMillis ? dt.toMillis() : dt || 0;
  const myOrders = DB.orders.filter(o => o.customerId === u.id).sort((a, b) => ts(b.createdAt) - ts(a.createdAt));
  const myReqs = DB.serviceRequests.filter(r => r.customerId === u.id);
  const grid = document.getElementById('mainGrid');
  if (!myOrders.length && !myReqs.length) {
    grid.innerHTML = `<div style="text-align:center;padding:60px 20px;color:var(--gy);grid-column:1/-1">
      <div style="font-size:2.5rem;margin-bottom:12px">📦</div>
      <div style="font-family:'Syne',sans-serif;font-weight:700">No orders yet</div>
      <div style="font-size:.84rem;margin-top:6px">Start shopping or book a service!</div>
    </div>`;
    return;
  }
  grid.innerHTML = [
    ...myOrders.map(o => {
      const rider = o.riderId ? DB.users.find(u => u.id === o.riderId) : null;
      const showTrack = o.status === 'picked_up';
      return `<div class="order-card" style="grid-column:1/-1;cursor:default">
        <div class="oc-top">
          <div><div class="oc-id">Order ${o.id}</div><div class="oc-cust">🏪 ${o.vendorName}</div></div>
          <div class="oc-status s-${o.status.replace(/_/g, '')}">${statusLabel(o.status)}</div>
        </div>
        <div class="oc-items">${o.items.map(i => `${i.emoji} ${i.name} ×${i.qty}`).join(' · ')}</div>
        ${rider ? `<div style="font-size:.74rem;color:var(--bl);margin-bottom:8px">🛵 ${rider.fname} ${rider.lname} · ${rider.phone}</div>` : ''}
        ${showTrack ? `<div style="background:var(--bg);border-radius:var(--r12);padding:10px 12px;font-size:.8rem;color:var(--bl);margin-bottom:8px">📍 Live tracking: Carrier is on the way!</div>` : ''}
        <div class="oc-foot"><div class="oc-addr">📍 ${o.address}</div><div class="oc-total">₹${o.total}</div></div>
      </div>`;
    }),
    ...myReqs.map(r => `
      <div class="order-card" style="grid-column:1/-1;cursor:default;border-color:${r.status === 'accepted' ? 'var(--gl)' : r.status === 'declined' ? 'var(--rd)' : 'var(--lt)'}">
        <div class="oc-top">
          <div><div class="oc-id">📋 Service Request</div><div class="oc-cust">${r.serviceType}</div></div>
          <div class="oc-status ${r.status === 'accepted' ? 's-accepted' : r.status === 'declined' ? 's-cancelled' : 's-requested'}">${r.status === 'accepted' ? '✓ Accepted' : r.status === 'declined' ? '✕ Declined' : '⏳ Pending'}</div>
        </div>
        <div class="oc-items">${r.issue}</div>
        ${r.declineReason ? `<div style="font-size:.74rem;color:var(--rd);margin-top:4px">Reason: ${r.declineReason}</div>` : ''}
        <div style="font-size:.72rem;color:var(--gy);margin-top:8px">📍 ${r.address}</div>
      </div>`)
  ].join('');
}

function closedToast(name, opensAt) {
  const t = opensInText(opensAt);
  toast(t ? `${name} — ${t}` : opensAt ? `${name} opens at ${fmtTime(opensAt)}` : `${name} is closed`, 'orange');
}

// ─── Shop Detail ───
function openDetail(vendorId) {
  currentVendorId = vendorId;
  const v = DB.users.find(u => u.id === vendorId); if (!v) return;
  const isS = v.type === 'service', isF = v.type === 'food';
  hideAll(); show('detailScreen');
  document.getElementById('dtName').textContent = v.bizName;
  document.getElementById('dtSub').textContent = `${v.category?.split('|')[1] || ''} · ${v.address || 'Local Area'} · ${(0.3 + Math.random() * 1.5).toFixed(1)}km`;
  document.getElementById('dItemsLbl').textContent = isS ? 'Services & Pricing' : isF ? 'Menu' : 'Items & Prices';
  document.getElementById('cartHd').innerHTML = isS ? '📋 Booking' : '🛒 Your Cart';
  document.getElementById('svcReqSection').style.display = isS ? 'block' : 'none';
  renderDetailItems(v); renderCartPanel(); updateCartBadges();
}

function renderDetailItems(v) {
  const isS = v.type === 'service', isF = v.type === 'food';
  const items = v.items || [];
  const el = document.getElementById('ilist');
  if (!items.length) { el.innerHTML = `<div style="text-align:center;padding:40px;color:var(--gy)">📭 Nothing listed yet</div>`; return; }
  el.innerHTML = items.map(item => {
    const qty = cartQty(v.id, item.id);
    return `<div class="irow ${item.avail ? '' : 'oos'}">
      <div class="ir-ic" style="background:${isS ? 'var(--bg)' : isF ? 'var(--fg)' : 'var(--og)'}">${item.emoji}</div>
      <div class="ir-inf">
        <div class="ir-nm">${item.name}</div>
        <div class="ir-ut">${item.unit}</div>
        ${item.desc ? `<div class="ir-ut" style="font-style:italic">${item.desc}</div>` : ''}
        ${!item.avail ? `<div class="ir-oos">${isS ? 'Unavailable' : 'Out of stock'}</div>` : ''}
      </div>
      <div class="ir-pr">₹${item.price}</div>
      ${item.avail ? (isS ? `
        <button class="book-now-btn" onclick="openBookModal('${v.id}','${item.id}','now')" title="15 min arrival">⚡ Now</button>
        <button class="book-later-btn" onclick="openBookModal('${v.id}','${item.id}','schedule')" title="Pick date & time">📅</button>
      ` : qty === 0 ? `<button class="add-btn" onclick="addCart('${v.id}','${item.id}')">Add +</button>` : `
        <div class="qty-ctrl">
          <button class="qbtn" onclick="changeQty('${v.id}','${item.id}',-1)">−</button>
          <div class="qnum">${qty}</div>
          <button class="qbtn" onclick="changeQty('${v.id}','${item.id}',1)">+</button>
        </div>`) : `<div style="font-size:.68rem;color:var(--gy);padding:4px 8px">N/A</div>`}
    </div>`;
  }).join('');
}

// ─── Service Request ───
function submitSvcRequest() {
  const u = getCU(); if (!u) return;
  const svcType = document.getElementById('reqSvcType').value;
  const issue = document.getElementById('reqIssue').value.trim();
  const addr = document.getElementById('reqAddr').value.trim();
  if (!svcType || !issue || !addr) { toast('Fill all fields', 'red'); return; }
  const matching = getVendors().filter(v => v.type === 'service' && v.category?.toLowerCase().includes(svcType.split(' ')[1]?.toLowerCase() || svcType));
  const req = {
    id: 'req_' + Date.now(), customerId: u.id, customerName: u.fname + ' ' + u.lname,
    phone: u.phone, serviceType: svcType, issue, address: addr,
    status: 'pending', createdAt: Date.now(), isNow: false,
    declineReason: '', serviceName: svcType
  };
  if (matching.length) {
    matching.forEach(v => {
      const vReq = { ...req, id: 'req_' + Date.now() + '_' + v.id, vendorId: v.id };
      if (db) Object.assign(vReq, { createdAt: firebase.firestore.FieldValue.serverTimestamp() });
      if (db) db.collection("serviceRequests").doc(vReq.id).set(vReq);
      else DB.serviceRequests.push(vReq);
    });
    toast('Request sent to ' + matching.length + ' service provider(s)! They\'ll contact you shortly 📞', 'blue');
  } else {
    req.vendorId = null;
    if (db) Object.assign(req, { createdAt: firebase.firestore.FieldValue.serverTimestamp() });
    if (db) db.collection("serviceRequests").doc(req.id).set(req);
    else DB.serviceRequests.push(req);
    toast('Request submitted! Our team will find you a provider within 2 hrs 📞', 'blue');
  }
  if (!db) saveDB();
  ['reqSvcType', 'reqIssue', 'reqAddr'].forEach(id => { document.getElementById(id).value = ''; });
}

// ─── Cart ───
function cartQty(shopId, itemId) { const c = DB.cart.find(x => x.shopId === shopId && x.itemId === itemId); return c ? c.qty : 0; }

function addCart(shopId, itemId) {
  if (DB.cart.length && DB.cart[0].shopId !== shopId) { if (!confirm('Clear cart and switch?')) return; DB.cart = []; }
  const v = DB.users.find(u => u.id === shopId);
  const item = (v.items || []).find(i => i.id === itemId);
  DB.cart.push({ shopId, itemId, qty: 1, name: item.name, price: item.price, emoji: item.emoji });
  saveDB(); updateCartBadges(); renderDetailItems(v); renderCartPanel(); updateFloatCart();
  toast(`${item.emoji} Added`);
}

function changeQty(shopId, itemId, delta) {
  const v = DB.users.find(u => u.id === shopId);
  const idx = DB.cart.findIndex(x => x.shopId === shopId && x.itemId === itemId);
  if (idx === -1) { if (delta > 0) addCart(shopId, itemId); return; }
  DB.cart[idx].qty += delta;
  if (DB.cart[idx].qty <= 0) DB.cart.splice(idx, 1);
  saveDB(); updateCartBadges(); renderDetailItems(v); renderCartPanel(); updateFloatCart();
}

function updateCartBadges() {
  const total = DB.cart.reduce((s, x) => s + x.qty, 0);
  ['cartBadge', 'cartBadge2'].forEach(id => { const el = document.getElementById(id); if (el) el.textContent = total; });
}

function updateFloatCart() {
  const fc = document.getElementById('floatCart'); if (!fc) return;
  const total = DB.cart.reduce((s, x) => s + x.qty, 0);
  const sum = DB.cart.reduce((s, x) => s + x.price * x.qty, 0);
  if (total > 0) { fc.classList.add('vis'); document.getElementById('floatTxt').textContent = `${total} item${total > 1 ? 's' : ''} · ₹${sum}`; }
  else fc.classList.remove('vis');
}

function renderCartPanel() {
  const p = document.getElementById('cartPanel'); if (!p) return;
  const v = DB.users.find(u => u.id === currentVendorId);
  const isS = v?.type === 'service';
  if (!DB.cart.length) {
    p.innerHTML = `<div class="cart-empty-p"><div style="font-size:2rem">${isS ? '📋' : '🛒'}</div><div>${isS ? 'Book a service above' : 'Cart is empty'}</div></div>`;
    return;
  }
  const sub = DB.cart.reduce((s, x) => s + x.price * x.qty, 0);
  const del = isS ? 0 : deliveryFeeForOrder(sub);
  p.innerHTML = `
    <div class="cart-list">${DB.cart.map(x => `
      <div class="ci">
        <div class="ci-ic">${x.emoji}</div>
        <div class="ci-inf"><div class="ci-nm">${x.name}</div><div class="ci-qp">×${x.qty} · ₹${x.price}</div></div>
        <div class="ci-tot">₹${x.price * x.qty}</div>
        <button class="ci-x" onclick="changeQty('${x.shopId}','${x.itemId}',-99)">✕</button>
      </div>`).join('')}</div>
    <div class="c-summary">
      <div class="cs-row"><span>Subtotal</span><span>₹${sub}</span></div>
      ${isS ? '' : `<div class="cs-row"><span>Delivery</span><span>${del ? '₹' + del : '🎉 Free'}</span></div>`}
      ${sub < 300 && !isS ? `<div style="font-size:.67rem;color:var(--gl);margin-bottom:5px">Add ₹${300 - sub} for free delivery</div>` : ''}
      <div class="cs-total"><span>Total</span><span>₹${sub + del}</span></div>
      <button class="checkout-btn" onclick="openCheckout()" style="${isS ? 'background:var(--b);box-shadow:0 4px 12px rgba(24,90,219,.2)' : ''}">
        ${isS ? 'Confirm Booking →' : 'Checkout →'}
      </button>
    </div>`;
}

// ─── Checkout ───
function openCheckout() {
  const u = getCU();
  document.getElementById('chkAddr').value = '';
  document.getElementById('chkPhone').value = u?.phone || '';
  const sub = DB.cart.reduce((s, x) => s + x.price * x.qty, 0);
  const v = DB.users.find(u => u.id === DB.cart[0]?.shopId);
  const del = v?.type === 'service' ? 0 : deliveryFeeForOrder(sub);
  document.getElementById('chkSummary').innerHTML = `
    ${DB.cart.map(x => `${x.emoji} ${x.name} ×${x.qty} — ₹${x.price * x.qty}`).join('<br>')}
    <hr style="border:1px solid var(--lt);margin:8px 0;">
    Subtotal: ₹${sub}<br>Delivery: ${del ? '₹' + del : 'Free'}<br><b>Total: ₹${sub + del}</b>`;
  closeM('cartModal');
  document.getElementById('checkoutModal').classList.remove('hidden');
}

function placeOrder() {
  const addr = document.getElementById('chkAddr').value.trim();
  const phone = document.getElementById('chkPhone').value.trim();
  if (!addr || !phone) { toast('Enter delivery address & phone', 'red'); return; }
  const u = getCU();
  const vendor = DB.users.find(u => u.id === DB.cart[0]?.shopId); if (!vendor) return;
  const isS = vendor.type === 'service';
  const sub = DB.cart.reduce((s, x) => s + x.price * x.qty, 0);
  const del = isS ? 0 : deliveryFeeForOrder(sub);
  const newOrder = {
    id: orderId(), customerId: u.id, customerName: u.fname + ' ' + u.lname,
    vendorId: vendor.id, vendorName: vendor.bizName, vendorAddress: vendor.address || 'Local Area',
    riderId: null, phone, address: addr,
    items: DB.cart.map(x => ({ name: x.name, price: x.price, qty: x.qty, emoji: x.emoji })),
    total: sub + del, deliveryFee: del, payment: document.getElementById('chkPayment').value,
    status: 'pending', createdAt: Date.now(),
  };
  if (db) Object.assign(newOrder, { createdAt: firebase.firestore.FieldValue.serverTimestamp() });
  
  if (db) db.collection("orders").doc(newOrder.id).set(newOrder);
  else DB.orders.push(newOrder);

  DB.cart = []; saveDB();
  updateCartBadges(); updateFloatCart(); renderCartPanel();
  closeM('checkoutModal');
  if (vendor) renderDetailItems(vendor);
  document.getElementById('cartPanel').innerHTML = `
    <div class="success-box">
      <div class="suc-ring suc-g">✓</div>
      <div style="font-family:'Syne',sans-serif;font-weight:800">Order Placed!</div>
      <div style="color:var(--gy);font-size:.8rem">from ${vendor.bizName}</div>
      <div style="background:var(--og);padding:10px 14px;border-radius:var(--r12);font-size:.8rem;text-align:left;width:100%">
        ⏳ Waiting for vendor to accept<br>🛵 Carrier will be assigned automatically
      </div>
      <div style="font-family:'Syne',sans-serif;font-weight:700;color:var(--o)">₹${newOrder.total} · ${newOrder.payment === 'cod' ? 'Cash on Delivery' : 'UPI'}</div>
      <button class="add-btn" onclick="setSection('myorders');goBack()" style="margin-top:8px">📦 Track Order</button>
    </div>`;
  toast(`🎉 Order ${newOrder.id} placed! Vendor will accept shortly`, 'green');
}

// ─── Booking (Services) ───
let bkVendorId = null, bkItemId = null, bkType = 'now';

function openBookModal(vendorId, itemId, type = 'now') {
  bkVendorId = vendorId; bkItemId = itemId;
  setBookType(type);
  document.getElementById('bookDate').value = new Date().toISOString().split('T')[0];
  document.getElementById('bookAddr').value = '';
  document.getElementById('bookNote').value = '';
  document.getElementById('bookSlot').value = '';
  document.querySelectorAll('.bslot').forEach(s => s.classList.remove('sel'));
  const v = DB.users.find(u => u.id === vendorId);
  const item = (v.items || []).find(i => i.id === itemId);
  document.getElementById('bookTitle').textContent = `Book: ${item?.name}`;
  document.getElementById('bookModal').classList.remove('hidden');
}

function setBookType(type) {
  bkType = type;
  document.getElementById('btNow').classList.toggle('sel', type === 'now');
  document.getElementById('btSchedule').classList.toggle('sel', type === 'schedule');
  document.getElementById('scheduleFields').style.display = type === 'schedule' ? 'block' : 'none';
}

function pickSlot(el, slot) {
  document.querySelectorAll('.bslot').forEach(s => s.classList.remove('sel'));
  el.classList.add('sel');
  document.getElementById('bookSlot').value = slot;
}

function confirmBooking() {
  const addr = document.getElementById('bookAddr').value.trim();
  if (!addr) { toast('Enter your address', 'red'); return; }
  if (bkType === 'schedule' && !document.getElementById('bookSlot').value) { toast('Select a time slot', 'red'); return; }
  const u = getCU();
  const v = DB.users.find(u => u.id === bkVendorId);
  const item = (v.items || []).find(i => i.id === bkItemId);
  const req = {
    id: 'req_' + Date.now(), customerId: u.id, customerName: u.fname + ' ' + u.lname,
    phone: u.phone, vendorId: bkVendorId, serviceType: v.category?.split('|')[1] || '',
    serviceName: item?.name || '', issue: document.getElementById('bookNote').value || 'Service booking',
    address: addr, status: 'pending', createdAt: Date.now(),
    isNow: bkType === 'now',
    scheduledDate: bkType === 'schedule' ? document.getElementById('bookDate').value : '',
    scheduledTime: bkType === 'schedule' ? document.getElementById('bookSlot').value : '',
    declineReason: '',
  };
  if (db) Object.assign(req, { createdAt: firebase.firestore.FieldValue.serverTimestamp() });

  if (db) db.collection("serviceRequests").doc(req.id).set(req);
  else DB.serviceRequests.push(req);
  
  if (!db) saveDB();
  
  closeM('bookModal');
  toast(bkType === 'now' ? `⚡ ${v.bizName} notified! Arriving in ~15 min` : `📅 Booked for ${req.scheduledDate} at ${req.scheduledTime}`, 'blue');
}

// ─── Cart Modal (Mobile) ───
function openCartModal() {
  const b = document.getElementById('cartModalBody');
  if (!DB.cart.length) {
    b.innerHTML = `<div style="text-align:center;padding:40px;color:var(--gy)"><div style="font-size:2.5rem;margin-bottom:12px">🛒</div>Cart is empty</div>`;
  } else {
    const sub = DB.cart.reduce((s, x) => s + x.price * x.qty, 0);
    const v = DB.users.find(u => u.id === DB.cart[0]?.shopId);
    const del = v?.type === 'service' ? 0 : deliveryFeeForOrder(sub);
    b.innerHTML = `<div style="display:flex;flex-direction:column;gap:7px;margin-bottom:12px">
      ${DB.cart.map(x => `<div class="ci"><div class="ci-ic">${x.emoji}</div>
        <div class="ci-inf"><div class="ci-nm">${x.name}</div><div class="ci-qp">×${x.qty} · ₹${x.price}</div></div>
        <div class="ci-tot">₹${x.price * x.qty}</div></div>`).join('')}
    </div>
    <div class="c-summary">
      <div class="cs-row"><span>Subtotal</span><span>₹${sub}</span></div>
      ${v?.type !== 'service' ? `<div class="cs-row"><span>Delivery</span><span>${del ? '₹' + del : 'Free'}</span></div>` : ''}
      <div class="cs-total"><span>Total</span><span>₹${sub + del}</span></div>
      <button class="checkout-btn" onclick="closeM('cartModal');openCheckout()">Checkout →</button>
    </div>`;
  }
  document.getElementById('cartModal').classList.remove('hidden');
}

// ─── Help / FAQ ───
let helpFrom = 'cust';

function showHelp(from) { helpFrom = from; hideAll(); show('helpScreen'); renderFAQ(); }

function renderFAQ() {
  document.getElementById('faqList').innerHTML = FAQS.map((f, i) => `
    <div onclick="this.querySelector('.faq-a').classList.toggle('open');this.querySelector('.arr').textContent=this.querySelector('.faq-a').classList.contains('open')?'▲':'▼'"
      style="background:#fff;border-radius:var(--r16);padding:14px 16px;margin-bottom:8px;border:1.5px solid var(--lt);cursor:pointer">
      <div style="font-family:'Syne',sans-serif;font-weight:700;font-size:.88rem;display:flex;justify-content:space-between;gap:10px">
        ${f.q}<span class="arr">▼</span></div>
      <div class="faq-a" style="font-size:.82rem;color:var(--gy);line-height:1.7;margin-top:10px;display:none">${f.a}</div>
    </div>`).join('');
}

function goBackHelp() {
  hideAll();
  const u = getCU();
  if (helpFrom === 'dash' && u?.role === 'vendor') { show('dashScreen'); }
  else if (u?.role === 'rider') { show('riderScreen'); }
  else { show('custScreen'); }
}

function goBack() { hide('detailScreen'); show('custScreen'); renderHome(); }
