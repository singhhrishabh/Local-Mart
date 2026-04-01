// LocalMart — Vendor Dashboard

function initDash(user) {
  const u = getCU();
  const isS = u.type === 'service', isF = u.type === 'food';
  document.getElementById('sbWho').textContent = (u.bizName || u.fname + ' ' + u.lname) + '\n' + u.email;
  document.getElementById('dashGreet').textContent = `${greet()}, ${u.fname} 👋`;
  document.getElementById('dashSub').textContent = isS ? 'Service provider dashboard' : isF ? 'Food stall dashboard' : 'Shop dashboard';
  document.getElementById('liveBoxLbl').textContent = isS ? 'Availability' : isF ? 'Stall Status' : 'Shop Visibility';
  document.getElementById('ordersNavLbl').textContent = isS ? 'Bookings' : 'Orders';
  document.getElementById('invIcSb').textContent = isS ? '🔧' : isF ? '🍽️' : '📦';
  document.getElementById('invLblSb').textContent = isS ? 'Services' : isF ? 'Menu' : 'Inventory';
  document.getElementById('invIcMob').textContent = isS ? '🔧' : isF ? '🍽️' : '📦';
  document.getElementById('invLblMob').textContent = isS ? 'Services' : isF ? 'Menu' : 'Inventory';
  document.getElementById('invTitle').textContent = isS ? 'My Services' : isF ? 'My Menu' : 'My Inventory';
  document.getElementById('addItemBtn').textContent = isS ? '＋ Add Service' : isF ? '＋ Add Dish' : '＋ Add Item';
  document.getElementById('stItemsLbl').textContent = isS ? 'Services' : isF ? 'Dishes' : 'Items';

  document.getElementById('dashTips').innerHTML = isS ?
    `<div style="padding:9px 12px;background:var(--bg);border-radius:var(--r12);font-size:.82rem;">📍 Toggle <b>Availability</b> so customers can book you.</div>
     <div style="padding:9px 12px;background:var(--og);border-radius:var(--r12);font-size:.82rem;">📋 Check <b>Bookings</b> tab for service requests — accept or decline with reason.</div>` :
    `<div style="padding:9px 12px;background:var(--og);border-radius:var(--r12);font-size:.82rem;">🔴 <b>Go Live</b> when your shop opens.</div>
     <div style="padding:9px 12px;background:var(--gg);border-radius:var(--r12);font-size:.82rem;">📋 Check <b>Orders</b> — accept to assign a delivery carrier.</div>
     <div style="padding:9px 12px;background:var(--lt2);border-radius:var(--r12);font-size:.82rem;">📷 <b>Add images</b> to items for better visibility.</div>`;

  updateLiveUI(); updateDashStats(); showPanel('dashboard');
  setInterval(() => { if (getCU()?.id === u.id) updateOrderBadge(); }, 3000);

  // Low-stock alerts
  const lowItems = checkLowStock(u);
  if (lowItems.length) {
    setTimeout(() => {
      lowItems.forEach(item => {
        toast(`⚠️ Low stock: ${item.emoji} ${item.name} — only ${item.stock} left!`, 'orange');
      });
    }, 1500);
  }
}

// ─── Live Toggle (with Safety Confirmation) ───
function updateLiveUI() {
  const u = getCU(); if (!u) return;
  const tgl = document.getElementById('liveTgl');
  const txt = document.getElementById('liveTxt');
  const or = document.getElementById('opensRow');
  if (u.isLive) {
    tgl.className = 'tgl on'; txt.className = 'lb-status lb-live';
    txt.innerHTML = '<span class="ldot d-live"></span>' + T('live');
    or.style.display = 'none';
  } else {
    tgl.className = 'tgl off'; txt.className = 'lb-status lb-off';
    txt.innerHTML = '<span class="ldot d-off"></span>' + T('offline');
    or.style.display = 'flex';
    document.getElementById('opensAt').value = u.opensAt || '';
  }
}

function toggleLive() {
  const u = getCU();
  const newState = !u.isLive;
  // Safety check: warn if going offline with active orders
  if (!newState) {
    const activeOrders = DB.orders.filter(o => o.vendorId === u.id && ['pending', 'vendor_accepted', 'rider_assigned'].includes(o.status));
    if (activeOrders.length > 0) {
      const msg = T('offline_warn').replace('{0}', activeOrders.length);
      if (!confirm(msg)) return;
    }
  }
  if (db) {
    db.collection("users").doc(u.id).update({ isLive: newState });
  } else {
    u.isLive = newState; saveDB(); updateLiveUI(); updateDashStats();
  }
  logAudit('vendor_toggle_live', u.id, `${u.bizName} → ${newState ? 'live' : 'offline'}`);
  toast(newState ? 'You\'re live! 🟢' : 'Marked as offline', 'green');
}

function saveOpensAt() {
  const u = getCU();
  const val = document.getElementById('opensAt').value;
  if(db) db.collection("users").doc(u.id).update({ opensAt: val });
  else { u.opensAt = val; saveDB(); }
  toast('Opening time saved', 'green');
}

// ─── Dashboard Stats ───
function updateDashStats() {
  const u = getCU(); if (!u) return;
  const items = u.items || [];
  document.getElementById('stItems').textContent = items.length;
  document.getElementById('stAvail').textContent = items.filter(i => i.avail).length;
  const myOrders = DB.orders.filter(o => o.vendorId === u.id);
  document.getElementById('stPending').textContent = myOrders.filter(o => o.status === 'pending').length;
  document.getElementById('stToday').textContent = myOrders.filter(o => o.status === 'delivered').length;
}

function updateOrderBadge() {
  const u = getCU(); if (!u) return;
  const pending = DB.orders.filter(o => o.vendorId === u.id && o.status === 'pending').length;
  const isService = u.type === 'service';
  const svcPending = isService ? DB.serviceRequests.filter(r => r.vendorId === u.id && r.status === 'pending').length : 0;
  const total = pending + svcPending;
  ['ordersBadge', 'ordersBadgeMob'].forEach(id => {
    const el = document.getElementById(id); if (!el) return;
    el.textContent = total; el.style.display = total > 0 ? 'flex' : 'none';
  });
}

// ─── Panel Navigation ───
function showPanel(panel) {
  ['dashboard', 'orders', 'inventory', 'profile'].forEach(p => {
    document.getElementById('panel' + p.charAt(0).toUpperCase() + p.slice(1))?.classList.toggle('hidden', p !== panel);
  });
  document.querySelectorAll('.sbn[data-p],.bni[data-p]').forEach(b => b.classList.toggle('act', b.dataset.p === panel));
  if (panel === 'inventory') renderInventory();
  if (panel === 'orders') renderVendorOrders();
  if (panel === 'profile') loadProfile();
  if (panel === 'dashboard') updateDashStats();
}

function vMobNav(panel, btn) {
  document.querySelectorAll('#vendorBnav .bni').forEach(b => b.classList.remove('act'));
  btn.classList.add('act'); showPanel(panel);
}

// ─── Vendor Orders ───
function renderVendorOrders() {
  const u = getCU(); if (!u) return;
  const isService = u.type === 'service';
  const el = document.getElementById('ordersList');

  if (isService) {
    const reqs = DB.serviceRequests.filter(r => r.vendorId === u.id);
    if (!reqs.length) { el.innerHTML = `<div style="text-align:center;padding:50px;color:var(--gy);">📭 No bookings yet</div>`; return; }
    el.innerHTML = reqs.map(r => `
      <div class="order-card">
        <div class="oc-top">
          <div><div class="oc-id">📋 ${r.isNow ? 'Book Now' : 'Scheduled'} · ${r.serviceName}</div>
          <div class="oc-cust">👤 ${r.customerName} · ${r.phone}</div></div>
          <div class="oc-status ${r.status === 'pending' ? 's-pending' : r.status === 'accepted' ? 's-accepted' : 's-cancelled'}">
            ${r.status === 'pending' ? 'Pending' : r.status === 'accepted' ? 'Accepted' : 'Declined'}
          </div>
        </div>
        <div class="oc-items">${r.isNow ? '⚡ Right Now' : '📅 ' + r.scheduledDate + ' at ' + r.scheduledTime}<br>📍 ${r.address}</div>
        ${r.status === 'pending' ? `
        <div class="oc-actions">
          <button class="oa-btn btn-accept" onclick="acceptServiceReq('${r.id}')">✓ Accept</button>
          <button class="oa-btn btn-reject" onclick="declineServiceReq('${r.id}')">✕ Decline</button>
        </div>` : `<div style="font-size:.74rem;color:var(--gy)">${r.declineReason ? 'Reason: ' + r.declineReason : ''}</div>`}
      </div>`).join('');
  } else {
    const ts = dt => dt && dt.toMillis ? dt.toMillis() : dt || 0;
    const orders = DB.orders.filter(o => o.vendorId === u.id).sort((a, b) => ts(b.createdAt) - ts(a.createdAt));
    if (!orders.length) { el.innerHTML = `<div style="text-align:center;padding:50px;color:var(--gy);">📭 No orders yet. Go live!</div>`; return; }
    el.innerHTML = orders.map(o => `
      <div class="order-card">
        <div class="oc-top">
          <div><div class="oc-id">Order ${o.id}</div><div class="oc-cust">👤 ${o.customerName} · ${o.phone}</div></div>
          <div class="oc-status s-${o.status.replace('_', '') || 'pending'}">${statusLabel(o.status)}</div>
        </div>
        <div class="oc-items">${o.items.map(i => `${i.emoji} ${i.name} ×${i.qty}`).join(' · ')}</div>
        <div class="oc-foot">
          <div class="oc-addr">📍 ${o.address}</div>
          <div class="oc-total">₹${o.total}</div>
          <div class="oc-actions" style="flex-wrap:wrap;gap:6px;">
            ${o.status === 'pending' ? `
            <button class="oa-btn btn-accept" onclick="acceptOrder('${o.id}')">✓ Accept</button>
            <button class="oa-btn" onclick="deliverOrderMyself('${o.id}')" style="background:var(--og);color:#fff;border-color:var(--og)">🛵 I'll deliver</button>
            <button class="oa-btn btn-reject" onclick="smartDeclineOrder('${o.id}')">✕ Decline</button>` : ''}
            ${o.status === 'rider_assigned' || o.status === 'vendor_accepted' ? `<div style="font-size:.72rem;color:var(--bl)">🛵 ${o.riderId ? DB.users.find(u => u.id === o.riderId)?.fname + ' on the way' : 'Awaiting carrier'}</div>` : ''}
          </div>
        </div>
      </div>`).join('');
  }
}

function acceptOrder(oid) {
  const o = DB.orders.find(x => x.id === oid); if (!o) return;
  const updates = { status: 'vendor_accepted', vendorAcceptedAt: Date.now() };
  if (db) db.collection("orders").doc(oid).update(updates);
  else { o.status = updates.status; o.vendorAcceptedAt = updates.vendorAcceptedAt; renderVendorOrders(); updateDashStats(); updateOrderBadge(); }
  // WhatsApp to vendor (self-notification for record)
  const u = getCU();
  if (u?.phone) triggerWhatsApp(u.phone, `New Order ${o.id}: ${o.items.map(i => i.name + ' ×' + i.qty).join(', ')} | Total: ₹${o.total} | Location: ${o.address}`);
  logAudit('order_accepted', oid, `Vendor ${u?.bizName} accepted`);
  toast(`✅ Order accepted! Waiting for carrier...`, 'green');
}

function deliverOrderMyself(oid) {
  const o = DB.orders.find(x => x.id === oid); if(!o) return;
  const u = getCU();
  const updates = { status: 'picked_up', vendorAcceptedAt: Date.now(), carrierId: u.id, riderId: u.id, pickedUpAt: Date.now() };
  if (db) db.collection("orders").doc(oid).update(updates);
  else { Object.assign(o, updates); renderVendorOrders(); updateDashStats(); updateOrderBadge(); }
  logAudit('vendor_self_deliver', oid, `${u.bizName} is delivering`);
  toast(`✅ You are now the carrier!`, 'green');
  setTimeout(() => { if(typeof switchToCarrierMode === 'function') switchToCarrierMode(); }, 1200);
}

/* Smart Decline: record reason, notify admin, suggest alternative */
function smartDeclineOrder(oid) {
  document.getElementById('declineReqId').value = oid;
  document.getElementById('declineReason').value = '';
  // Reuse decline modal
  document.getElementById('declineModal').classList.remove('hidden');
  // Override confirm handler for orders (not service reqs)
  window._declineIsOrder = true;
}

function confirmDecline() {
  const reqId = document.getElementById('declineReqId').value;
  const reason = document.getElementById('declineReason').value.trim();
  if (!reason) { toast('Please give a reason', 'red'); return; }

  if (window._declineIsOrder) {
    // Smart decline for orders
    if (db) db.collection("orders").doc(reqId).update({ status: 'cancelled', declineReason: reason });
    else { const o = DB.orders.find(x => x.id === reqId); if (o) { o.status = 'cancelled'; o.declineReason = reason; } }
    // Notify customer via SMS with alternative shop suggestion
    const o = DB.orders.find(x => x.id === reqId);
    if (o) {
      const altVendors = getVendors().filter(v => v.isLive && v.id !== o.vendorId && v.type !== 'service');
      const altMsg = altVendors.length ? ` Try: ${altVendors[0].bizName}` : '';
      if (o.phone) triggerSMS(o.phone, `LocalMart: Your order ${o.id} was declined. Reason: ${reason}.${altMsg}`);
      logAudit('order_declined', reqId, `Reason: ${reason}. Alt: ${altMsg}`);
    }
    renderVendorOrders(); updateDashStats(); updateOrderBadge();
    window._declineIsOrder = false;
    closeM('declineModal');
    toast('Order declined — customer notified', 'orange');
  } else {
    // Service request decline
    if (db) db.collection("serviceRequests").doc(reqId).update({ status: 'declined', declineReason: reason });
    else { const r = DB.serviceRequests.find(x => x.id === reqId); if (r) { r.status = 'declined'; r.declineReason = reason; } }
    logAudit('service_declined', reqId, `Reason: ${reason}`);
    renderVendorOrders(); updateOrderBadge();
    closeM('declineModal');
    toast('Request declined', 'orange');
  }
}

function acceptServiceReq(reqId) {
  if (db) db.collection("serviceRequests").doc(reqId).update({ status: 'accepted' });
  else { const r = DB.serviceRequests.find(x => x.id === reqId); if (r) r.status = 'accepted'; renderVendorOrders(); updateOrderBadge(); }
  logAudit('service_accepted', reqId, 'Vendor accepted service request');
  toast('Booking accepted! Customer notified 📞', 'green');
}

function declineServiceReq(reqId) {
  window._declineIsOrder = false;
  document.getElementById('declineReqId').value = reqId;
  document.getElementById('declineReason').value = '';
  document.getElementById('declineModal').classList.remove('hidden');
}

// ─── Inventory Management (with Image Upload) ───
const SHOP_EM = ['🥬','🍅','🌿','🌱','🌶️','🥦','🍆','🥕','🧅','🧄','🍎','🍌','🥭','🥛','🧀','🧈','🫙','🥚','🍞','🛒','🧂','🌾','🍜','🧼','🫧','🎁'];
const FOOD_EM = ['🍽️','🫧','🥣','🥔','🥙','🫔','🍱','🥟','🧆','🍞','🥐','🍮','🎂','🍰','🍬','🥤','🧃','☕','🍛','🍲','🧁','🍩','🍪','🍜'];
const SVC_EM = ['🔧','🪚','🧹','✨','⚡','🎨','❄️','🚿','🪣','🛋️','🚪','📚','🪟','🏠','🔌','💨','🔩','🌡️','🏗️','📋','👔','🤵','👗','🪥','🫧'];
let editItemId = null;

function openItemModal(id = null) {
  const u = getCU(); const isS = u.type === 'service', isF = u.type === 'food';
  editItemId = id;
  document.getElementById('modalTitle').textContent = id ? (isS ? 'Edit Service' : isF ? 'Edit Dish' : 'Edit Item') : (isS ? 'Add Service' : isF ? 'Add Dish' : 'Add Item');
  document.getElementById('iNmLbl').textContent = isS ? 'Service Name' : isF ? 'Dish Name' : 'Item Name';
  document.getElementById('iUtLbl').textContent = isS ? 'Rate / Basis' : isF ? 'Per / Qty' : 'Unit';
  document.getElementById('iDescGroup').style.display = isS ? 'block' : 'none';
  renderEmojiPicker(isS ? SVC_EM : isF ? FOOD_EM : SHOP_EM);

  // Image preview reset
  const imgPrev = document.getElementById('iImgPreview');
  if (imgPrev) imgPrev.innerHTML = '';
  const imgInput = document.getElementById('iImg');
  if (imgInput) imgInput.value = '';

  if (id) {
    const item = (u.items || []).find(i => i.id === id);
    document.getElementById('iNm').value = item.name;
    document.getElementById('iPr').value = item.price;
    document.getElementById('iUt').value = item.unit;
    document.getElementById('iDesc').value = item.desc || '';
    selectEmoji(item.emoji);
    if (item.image && imgPrev) imgPrev.innerHTML = `<img src="${item.image}" style="max-width:100%;border-radius:var(--r12);margin-top:6px">`;
  } else {
    ['iNm', 'iPr', 'iUt', 'iDesc'].forEach(x => document.getElementById(x).value = '');
    selectEmoji((isS ? SVC_EM : isF ? FOOD_EM : SHOP_EM)[0]);
  }
  document.getElementById('itemModal').classList.remove('hidden');
}

function renderEmojiPicker(em) {
  document.getElementById('emojiPicker').innerHTML = em.map(e => `<button class="epb" data-e="${e}" onclick="selectEmoji('${e}')">${e}</button>`).join('');
}

function selectEmoji(e) {
  document.getElementById('selEmoji').value = e;
  document.querySelectorAll('.epb').forEach(b => b.classList.toggle('sel', b.dataset.e === e));
}

/* Preview image on select */
function previewItemImage(input) {
  const file = input.files[0]; if (!file) return;
  const prev = document.getElementById('iImgPreview');
  compressImage(file, 300, 0.6).then(dataUrl => {
    prev.innerHTML = `<img src="${dataUrl}" style="max-width:100%;border-radius:var(--r12);margin-top:6px">`;
    prev.dataset.compressed = dataUrl;
  });
}

async function saveItem() {
  const u = getCU();
  const name = document.getElementById('iNm').value.trim();
  const price = parseFloat(document.getElementById('iPr').value);
  const unit = document.getElementById('iUt').value.trim();
  const emoji = document.getElementById('selEmoji').value || '📦';
  const desc = document.getElementById('iDesc').value.trim();
  if (!name || !price || !unit) { toast('Fill all fields', 'red'); return; }
  if (!u.items) u.items = [];

  // Get compressed image if uploaded
  const imgPrev = document.getElementById('iImgPreview');
  const image = imgPrev?.dataset?.compressed || (editItemId ? (u.items.find(i => i.id === editItemId)?.image || '') : '');

  if (editItemId) {
    const item = u.items.find(i => i.id === editItemId);
    Object.assign(item, { name, price, unit, emoji, desc, image });
    toast('Updated ✓');
  } else {
    const newItem = { id: 'i_' + Date.now(), name, price, unit, emoji, avail: true, desc, image };
    u.items.push(newItem);
    // Cache thumbnail for offline browsing
    if (image) cacheThumbnail(newItem.id, image);
    toast('Added ✓');
  }
  if (db) { db.collection("users").doc(u.id).update({ items: u.items }); }
  else { saveDB(); }
  logAudit('item_saved', u.id, `${editItemId ? 'Updated' : 'Added'}: ${name}`);
  closeM('itemModal'); renderInventory(); updateDashStats();
}

function toggleAvail(id) {
  const u = getCU();
  const item = u.items.find(i => i.id === id);
  item.avail = !item.avail;
  if(db) db.collection("users").doc(u.id).update({ items: u.items });
  else saveDB();
  renderInventory(); updateDashStats();
}

function delItem(id) {
  const u = getCU();
  u.items = u.items.filter(i => i.id !== id);
  if(db) db.collection("users").doc(u.id).update({ items: u.items });
  else saveDB();
  renderInventory(); updateDashStats();
}

function renderInventory(search = '') {
  const u = getCU(); const isS = u.type === 'service', isF = u.type === 'food';
  const items = (u.items || []).filter(i => !search || i.name.toLowerCase().includes(search.toLowerCase()));
  const grid = document.getElementById('itemsGrid');
  if (!items.length) { grid.innerHTML = `<div style="text-align:center;padding:50px;color:var(--gy);grid-column:1/-1">${search ? '🔍 No results' : '📭 Nothing listed yet'}</div>`; return; }
  grid.innerHTML = items.map(item => `
    <div class="icard ${item.avail ? '' : 'oos-card'}">
      ${item.image ? `<div style="height:80px;overflow:hidden;border-radius:var(--r20) var(--r20) 0 0"><img src="${item.image}" style="width:100%;height:100%;object-fit:cover"></div>` : ''}
      <div class="ic-top">
        <div class="ic-em" style="background:${isS ? 'var(--bg)' : isF ? 'var(--fg)' : 'var(--og)'}">${item.emoji}</div>
        <div class="ic-inf">
          <div class="ic-nm">${item.name}</div><div class="ic-ut">${item.unit}</div>
          ${item.desc ? `<div class="ic-ut" style="font-style:italic">${item.desc}</div>` : ''}
          <div class="ic-pr">₹${item.price}</div>
          ${!item.avail ? `<div style="font-size:.6rem;font-weight:700;padding:2px 8px;border-radius:var(--r100);background:rgba(217,48,37,.1);color:var(--rd);display:inline-block;margin-top:3px;">${isS ? 'UNAVAILABLE' : 'OUT OF STOCK'}</div>` : ''}
        </div>
      </div>
      <div class="ic-bot">
        <button class="icb b-edit" onclick="openItemModal('${item.id}')">✏️</button>
        <button class="icb ${item.avail ? 'b-oos' : 'b-rst'}" onclick="toggleAvail('${item.id}')">${item.avail ? '🚫' : '✅'}</button>
        <button class="icb b-del" onclick="delItem('${item.id}')">🗑️</button>
      </div>
    </div>`).join('');
}

// ─── Profile ───
function loadProfile() {
  const u = getCU();
  document.getElementById('pfFn').value = u.fname || '';
  document.getElementById('pfLn').value = u.lname || '';
  document.getElementById('pfNm').value = u.bizName || '';
  document.getElementById('pfPh').value = u.phone || '';
  document.getElementById('pfAddr').value = u.address || '';
  document.getElementById('pfNmLbl').textContent = u.type === 'service' ? 'Business Name' : u.type === 'food' ? 'Stall Name' : 'Shop Name';
}

function saveProfile() {
  const u = getCU();
  u.fname = document.getElementById('pfFn').value.trim();
  u.lname = document.getElementById('pfLn').value.trim();
  u.bizName = document.getElementById('pfNm').value.trim();
  u.phone = document.getElementById('pfPh').value.trim();
  u.address = document.getElementById('pfAddr').value.trim();
  saveDB();
  document.getElementById('sbWho').textContent = (u.bizName || u.fname + ' ' + u.lname) + '\n' + u.email;
  toast('Saved ✓');
}
