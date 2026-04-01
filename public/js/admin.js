// ═══ LocalMart — Admin "God-Mode" Control Tower ═══
// Full CRUD, Live Status, Inventory Oversight, Comms Log

const ADMIN_EMAIL = 'admin@localmart.in';
let adminPanel = 'aDash';
let _adminReady = false;

function isAdmin(user) { return user?.email === ADMIN_EMAIL; }

// ─── Init Admin Dashboard ───
// Since data.js uses local-first architecture, DB.users always has DEMOS
function initAdmin() {
  document.getElementById('adminWho').textContent = 'Super Admin\n' + ADMIN_EMAIL;
  _adminReady = true;
  console.log('[Admin] Initialized with', DB.users.length, 'users');
  showAdminPanel('aDash');
}

// ─── Panel Navigation ───
function showAdminPanel(panel) {
  adminPanel = panel;
  ['aDash','aVendors','aCustomers','aCarriers','aOrders','aAudit'].forEach(p => {
    const el = document.getElementById('panel_' + p); if (el) el.classList.toggle('hidden', p !== panel);
  });
  document.querySelectorAll('#adminScreen .sbn[data-ap]').forEach(b => b.classList.toggle('act', b.dataset.ap === panel));
  refreshAdminPanel();
}

function refreshAdminPanel() {
  if (adminPanel === 'aDash') renderAdminDash();
  if (adminPanel === 'aVendors') renderAdminVendors();
  if (adminPanel === 'aCustomers') renderAdminCustomers();
  if (adminPanel === 'aCarriers') renderAdminCarriers();
  if (adminPanel === 'aOrders') renderAdminOrders();
  if (adminPanel === 'aAudit') renderAdminAudit();
}

// Called from data.js onSnapshot — keeps admin panels live
function adminLiveRefresh() {
  if (!_adminReady) return;
  const as = document.getElementById('adminScreen');
  if (!as || as.classList.contains('hidden')) return;
  refreshAdminPanel();
}

function aMobNav(panel, btn) {
  document.querySelectorAll('#adminBnav .bni').forEach(b => b.classList.remove('act'));
  btn.classList.add('act'); showAdminPanel(panel);
}

// ═══ DASHBOARD ═══
function renderAdminDash() {
  const vendors = getVendors(), customers = DB.users.filter(u => u.role === 'customer');
  const riders = getRiders(), orders = DB.orders;
  const liveV = vendors.filter(v => v.isLive).length;
  const liveR = riders.filter(r => r.isLive).length;
  const delivered = orders.filter(o => o.status === 'delivered').length;
  const pending = orders.filter(o => o.status === 'pending').length;
  const activeCarry = orders.filter(o => ['rider_assigned','picked_up'].includes(o.status)).length;

  document.getElementById('admin_dash_content').innerHTML = `
    <div class="stats-row" style="grid-template-columns:repeat(auto-fill,minmax(120px,1fr))">
      <div class="st"><div class="st-v c-o">${vendors.length}</div><div class="st-l">Vendors</div><div style="font-size:.6rem;color:var(--gl)">${liveV} live</div></div>
      <div class="st"><div class="st-v c-g">${customers.length}</div><div class="st-l">Customers</div></div>
      <div class="st"><div class="st-v c-b">${riders.length}</div><div class="st-l">Carriers</div><div style="font-size:.6rem;color:var(--gl)">${liveR} on route</div></div>
      <div class="st"><div class="st-v" style="color:var(--p)">${orders.length}</div><div class="st-l">Total Orders</div></div>
      <div class="st"><div class="st-v c-r">${pending}</div><div class="st-l">Pending</div></div>
      <div class="st"><div class="st-v" style="color:var(--o)">${activeCarry}</div><div class="st-l">In Transit</div></div>
      <div class="st"><div class="st-v c-g">${delivered}</div><div class="st-l">Delivered</div></div>
    </div>
    <div class="card"><div class="card-h">📊 System Health</div>
      <div style="font-size:.82rem;line-height:2;color:var(--gy)">
        🟢 Firebase Connected<br>
        📦 Offline DB: ${_idb ? 'Ready' : 'Initializing'}<br>
        🌐 Status: ${navigator.onLine ? 'Online' : '⚠️ Offline'}<br>
        🗺️ Region: Pratapgarh & Jaunpur<br>
        👥 Total Users: ${DB.users.length}
      </div>
    </div>
    <div class="card"><div class="card-h">📡 Recent Communications</div>
      <div id="dashCommsPreview" style="font-size:.78rem;color:var(--gy);line-height:1.8">Loading...</div>
    </div>`;
  // Load recent comms
  loadRecentComms('dashCommsPreview', 5);
}

// ═══ VENDORS PANEL ═══
function renderAdminVendors() {
  const el = document.getElementById('admin_vendors_content');
  const vendors = getVendors();
  const addBtn = `<div style="margin-bottom:14px"><button class="btn-auth" style="width:auto;padding:9px 18px;font-size:.82rem" onclick="openAdminAddUser('vendor')">＋ Add Vendor</button></div>`;

  if (!vendors.length) { el.innerHTML = addBtn + '<div style="text-align:center;padding:40px;color:var(--gy)">No vendors yet</div>'; return; }

  el.innerHTML = addBtn + vendors.map(v => {
    const pendingOrders = DB.orders.filter(o => o.vendorId === v.id && o.status === 'pending').length;
    const totalOrders = DB.orders.filter(o => o.vendorId === v.id).length;
    const itemCount = (v.items || []).length;
    const statusBadge = v.isLive
      ? `<span style="color:var(--gl);font-weight:600">🟢 Live${pendingOrders ? ' · ' + pendingOrders + ' pending' : ''}</span>`
      : `<span style="color:var(--gy)">⚫ Offline${v.opensAt ? ' · Opens ' + fmtTime(v.opensAt) : ''}</span>`;

    return `<div class="order-card">
      <div class="oc-top">
        <div><div class="oc-id">${v.bizName || v.fname}</div>
        <div class="oc-cust">${v.email} · ${v.phone || 'N/A'}</div>
        <div style="font-size:.7rem;color:var(--gy)">${v.category?.split('|')[1] || ''} · ${v.address || 'N/A'}</div></div>
        <div style="text-align:right">${statusBadge}</div>
      </div>
      <div class="oc-items">📦 ${itemCount} items · 📋 ${totalOrders} orders</div>
      <div class="oc-actions" style="margin-top:8px;flex-wrap:wrap;gap:6px">
        <button class="oa-btn btn-accept" onclick="adminViewInventory('${v.id}')">📦 Inventory</button>
        <button class="oa-btn" style="background:var(--bg);border-color:var(--bl);color:var(--bl)" onclick="openAdminEditUser('${v.id}')">✏️ Edit</button>
        <button class="oa-btn btn-accept" onclick="adminToggleLive('${v.id}')">${v.isLive ? '⏸ Offline' : '▶ Live'}</button>
        <button class="oa-btn btn-reject" onclick="adminDeleteUser('${v.id}')">🗑️</button>
      </div>
    </div>`;
  }).join('');
}

// ═══ CUSTOMERS PANEL ═══
function renderAdminCustomers() {
  const el = document.getElementById('admin_customers_content');
  const customers = DB.users.filter(u => u.role === 'customer');
  const addBtn = `<div style="margin-bottom:14px"><button class="btn-auth" style="width:auto;padding:9px 18px;font-size:.82rem" onclick="openAdminAddUser('customer')">＋ Add Customer</button></div>`;

  if (!customers.length) { el.innerHTML = addBtn + '<div style="text-align:center;padding:40px;color:var(--gy)">No customers yet</div>'; return; }

  el.innerHTML = addBtn + customers.map(c => {
    const myOrders = DB.orders.filter(o => o.customerId === c.id);
    const pendingO = myOrders.filter(o => o.status === 'pending').length;
    const statusTxt = myOrders.length
      ? `📦 ${myOrders.length} orders${pendingO ? ' (' + pendingO + ' pending)' : ''}`
      : '🆕 No orders yet';

    return `<div class="order-card">
      <div class="oc-top">
        <div><div class="oc-id">${c.fname} ${c.lname || ''}</div>
        <div class="oc-cust">${c.email} · ${c.phone || 'N/A'}</div></div>
      </div>
      <div class="oc-items">${statusTxt}</div>
      <div class="oc-actions" style="margin-top:8px;gap:6px">
        <button class="oa-btn" style="background:var(--bg);border-color:var(--bl);color:var(--bl)" onclick="openAdminEditUser('${c.id}')">✏️ Edit</button>
        <button class="oa-btn btn-reject" onclick="adminDeleteUser('${c.id}')">🗑️</button>
      </div>
    </div>`;
  }).join('');
}

// ═══ CARRIERS PANEL ═══
function renderAdminCarriers() {
  const el = document.getElementById('admin_carriers_content');
  const riders = getRiders();
  const addBtn = `<div style="margin-bottom:14px"><button class="btn-auth" style="width:auto;padding:9px 18px;font-size:.82rem" onclick="openAdminAddUser('carrier')">＋ Add Carrier</button></div>`;

  if (!riders.length) { el.innerHTML = addBtn + '<div style="text-align:center;padding:40px;color:var(--gy)">No carriers yet</div>'; return; }

  el.innerHTML = addBtn + riders.map(r => {
    const activeOrder = DB.orders.find(o => o.riderId === r.id && ['rider_assigned','picked_up'].includes(o.status));
    let statusBadge;
    if (activeOrder) {
      statusBadge = `<span style="color:var(--o);font-weight:600">🛵 On Delivery (${activeOrder.id})</span>`;
    } else if (r.isLive) {
      statusBadge = `<span style="color:var(--gl);font-weight:600">🟢 On Route</span>`;
    } else {
      statusBadge = `<span style="color:var(--gy)">⚫ Off Duty</span>`;
    }

    return `<div class="order-card">
      <div class="oc-top">
        <div><div class="oc-id">${r.fname} ${r.lname || ''}</div>
        <div class="oc-cust">${r.email} · ${r.phone || 'N/A'}</div></div>
        <div style="text-align:right">${statusBadge}</div>
      </div>
      <div class="oc-items">📍 ${r.routeFrom || '?'} → ${r.routeTo || '?'} · 📦 ${r.deliveries || 0} deliveries · 💰 ₹${r.earnings || 0}</div>
      <div class="oc-actions" style="margin-top:8px;gap:6px">
        <button class="oa-btn" style="background:var(--bg);border-color:var(--bl);color:var(--bl)" onclick="openAdminEditUser('${r.id}')">✏️ Edit</button>
        <button class="oa-btn btn-reject" onclick="adminDeleteUser('${r.id}')">🗑️</button>
      </div>
    </div>`;
  }).join('');
}

// ═══ ORDERS PANEL ═══
function renderAdminOrders() {
  const el = document.getElementById('admin_orders_content');
  const ts = dt => dt && dt.toMillis ? dt.toMillis() : dt || 0;
  const orders = [...DB.orders].sort((a, b) => ts(b.createdAt) - ts(a.createdAt));

  if (!orders.length) { el.innerHTML = '<div style="text-align:center;padding:40px;color:var(--gy)">No orders yet</div>'; return; }

  el.innerHTML = orders.map(o => {
    const rider = o.riderId ? DB.users.find(u => u.id === o.riderId) : null;
    const stages = [
      {lbl: '📝 Placed', done: true},
      {lbl: '📢 Notified', done: ['vendor_accepted','rider_assigned','picked_up','delivered'].includes(o.status)},
      {lbl: '✅ Accepted', done: ['vendor_accepted','rider_assigned','picked_up','delivered'].includes(o.status)},
      {lbl: '🛵 Carrying', done: ['picked_up','delivered'].includes(o.status)},
      {lbl: '✓ Delivered', done: o.status === 'delivered'},
    ];
    return `<div class="order-card">
      <div class="oc-top">
        <div><div class="oc-id">Order ${o.id}</div><div class="oc-cust">🏪 ${o.vendorName} → 👤 ${o.customerName}</div></div>
        <div class="oc-status s-${o.status.replace(/_/g,'')}">${statusLabel(o.status)}</div>
      </div>
      <div class="oc-items">${o.items.map(i => i.emoji + ' ' + i.name + ' ×' + i.qty).join(' · ')}</div>
      <div style="display:flex;gap:4px;margin:8px 0;flex-wrap:wrap">${stages.map(s =>
        `<span style="font-size:.58rem;padding:2px 6px;border-radius:var(--r100);background:${s.done ? 'var(--gg)' : 'var(--lt2)'};color:${s.done ? 'var(--gl)' : 'var(--gy)'}">${s.lbl}</span>`
      ).join('')}</div>
      ${rider ? `<div style="font-size:.72rem;color:var(--bl)">🛵 Carrier: ${rider.fname} ${rider.lname}</div>` : ''}
      <div class="oc-foot"><div class="oc-addr">📍 ${o.address}</div><div class="oc-total">₹${o.total}</div></div>
      <div class="oc-actions" style="margin-top:6px">
        <button class="oa-btn btn-reject" onclick="adminDeleteOrder('${o.id}')">🗑️</button>
        ${o.status !== 'delivered' && o.status !== 'cancelled' ? `<button class="oa-btn btn-accept" onclick="adminForceDeliver('${o.id}')">⚡ Force Deliver</button>` : ''}
      </div>
    </div>`;
  }).join('');
}

// ═══ AUDIT LOG ═══
async function renderAdminAudit() {
  const el = document.getElementById('admin_audit_content');
  let logs = [];
  try {
    if (db && navigator.onLine) {
      const snap = await db.collection('auditLog').orderBy('ts', 'desc').limit(50).get();
      logs = snap.docs.map(d => d.data());
    }
  } catch (e) {}
  if (!logs.length) { el.innerHTML = '<div style="text-align:center;padding:40px;color:var(--gy)">No audit entries yet.</div>'; return; }
  el.innerHTML = logs.map(l => {
    const icon = l.type?.includes('whatsapp') ? '💬' : l.type?.includes('sms') ? '📱' : l.type?.includes('order') ? '📦' : l.type?.includes('carrier') ? '🛵' : '📝';
    return `<div style="background:#fff;border-radius:var(--r12);padding:10px 14px;margin-bottom:6px;border:1px solid var(--lt);font-size:.78rem">
      ${icon} <b>${l.type}</b> · ${l.refId}<br><span style="color:var(--gy)">${l.detail} · ${new Date(l.ts).toLocaleString('en-IN')}</span>
    </div>`;
  }).join('');
}

// ═══ CRUD OPERATIONS ═══

// Delete user
function adminDeleteUser(uid) {
  if (!confirm('Delete this user permanently?')) return;
  if (db) db.collection('users').doc(uid).delete();
  toast('User deleted', 'red');
  logAudit('user_deleted', uid, 'Admin deleted user');
  setTimeout(() => refreshAdminPanel(), 800);
}

// Toggle vendor live status
function adminToggleLive(uid) {
  const u = DB.users.find(x => x.id === uid); if (!u) return;
  if (db) db.collection('users').doc(uid).update({isLive: !u.isLive});
  logAudit('admin_toggle_live', uid, `Set ${u.bizName || u.fname} to ${u.isLive ? 'offline' : 'live'}`);
  setTimeout(() => renderAdminVendors(), 800);
}

// Delete order
function adminDeleteOrder(oid) {
  if (!confirm('Delete this order?')) return;
  if (db) db.collection('orders').doc(oid).delete();
  toast('Order deleted', 'red');
  logAudit('order_deleted', oid, 'Admin deleted order');
  setTimeout(() => renderAdminOrders(), 800);
}

// Force deliver order
function adminForceDeliver(oid) {
  if (db) db.collection('orders').doc(oid).update({status: 'delivered', deliveredAt: Date.now()});
  toast('Order force-delivered', 'green');
  logAudit('order_force_delivered', oid, 'Admin force-delivered');
  setTimeout(() => renderAdminOrders(), 800);
}

// ═══ ADD USER MODAL ═══
function openAdminAddUser(role = 'vendor') {
  document.getElementById('aAddRole').value = role;
  document.getElementById('aAddFn').value = '';
  document.getElementById('aAddLn').value = '';
  document.getElementById('aAddEmail').value = '';
  document.getElementById('aAddPhone').value = '';
  document.getElementById('aAddPass').value = '';
  document.getElementById('aAddBizName').value = '';
  document.getElementById('aAddCategory').value = '';
  document.getElementById('aAddAddress').value = '';

  const bizFields = document.getElementById('aAddBizFields');
  bizFields.style.display = (role === 'customer' || role === 'carrier') ? 'none' : 'block';

  document.getElementById('aAddTitle').textContent = role === 'vendor' ? 'Add Vendor' : role === 'customer' ? 'Add Customer' : 'Add Carrier';
  document.getElementById('adminAddUserModal').classList.remove('hidden');
}

async function adminSaveNewUser() {
  const role = document.getElementById('aAddRole').value;
  const email = document.getElementById('aAddEmail').value.trim().toLowerCase();
  const pass = document.getElementById('aAddPass').value || 'pass123';
  const fname = document.getElementById('aAddFn').value.trim();
  const lname = document.getElementById('aAddLn').value.trim();
  const phone = document.getElementById('aAddPhone').value.trim();

  if (!fname || !email) { toast('Name and email required', 'red'); return; }

  const nu = {
    id: 'u_' + Date.now(),
    email, password: pass, fname, lname, phone,
    role: role === 'carrier' ? 'rider' : role,
    mapX: 40 + Math.random() * 220,
    mapY: 20 + Math.random() * 160,
  };

  if (role === 'vendor' || role === 'food' || role === 'service') {
    nu.role = 'vendor';
    nu.bizName = document.getElementById('aAddBizName').value.trim() || fname;
    nu.category = document.getElementById('aAddCategory').value || 'shop|🛒 Kirana';
    nu.type = nu.category.startsWith('service') ? 'service' : nu.category.startsWith('food') ? 'food' : 'shop';
    nu.address = document.getElementById('aAddAddress').value.trim();
    nu.isLive = false; nu.opensAt = ''; nu.items = [];
  }

  if (role === 'carrier') {
    nu.isLive = false; nu.earnings = 0; nu.deliveries = 0;
    nu.routeFrom = ''; nu.routeTo = '';
  }

  if (db) await db.collection('users').doc(nu.id).set(nu);
  else { DB.users.push(nu); saveDB(); }

  closeM('adminAddUserModal');
  toast(`${fname} added as ${role}`, 'green');
  logAudit('admin_add_user', nu.id, `Admin added ${role}: ${fname} (${email})`);
  setTimeout(() => refreshAdminPanel(), 800);
}

// ═══ EDIT USER MODAL ═══
let _editUserId = null;

function openAdminEditUser(uid) {
  const u = DB.users.find(x => x.id === uid); if (!u) return;
  _editUserId = uid;

  document.getElementById('aEditFn').value = u.fname || '';
  document.getElementById('aEditLn').value = u.lname || '';
  document.getElementById('aEditEmail').value = u.email || '';
  document.getElementById('aEditPhone').value = u.phone || '';
  document.getElementById('aEditBizName').value = u.bizName || '';
  document.getElementById('aEditAddress').value = u.address || '';

  const bizRow = document.getElementById('aEditBizFields');
  bizRow.style.display = u.role === 'vendor' ? 'block' : 'none';

  document.getElementById('aEditTitle').textContent = `Edit: ${u.bizName || u.fname || u.email}`;
  document.getElementById('adminEditUserModal').classList.remove('hidden');
}

async function adminSaveEditUser() {
  if (!_editUserId) return;
  const u = DB.users.find(x => x.id === _editUserId); if (!u) return;

  const updates = {
    fname: document.getElementById('aEditFn').value.trim(),
    lname: document.getElementById('aEditLn').value.trim(),
    email: document.getElementById('aEditEmail').value.trim().toLowerCase(),
    phone: document.getElementById('aEditPhone').value.trim(),
  };
  if (u.role === 'vendor') {
    updates.bizName = document.getElementById('aEditBizName').value.trim();
    updates.address = document.getElementById('aEditAddress').value.trim();
  }

  if (db) await db.collection('users').doc(_editUserId).update(updates);
  else { Object.assign(u, updates); saveDB(); }

  closeM('adminEditUserModal');
  toast('User updated', 'green');
  logAudit('admin_edit_user', _editUserId, `Admin edited ${updates.fname}`);
  setTimeout(() => refreshAdminPanel(), 800);
}

// ═══ INVENTORY OVERSIGHT ═══
let _invVendorId = null;

function adminViewInventory(vendorId) {
  const v = DB.users.find(u => u.id === vendorId); if (!v) return;
  _invVendorId = vendorId;
  document.getElementById('aInvTitle').textContent = `📦 ${v.bizName || v.fname} — Inventory`;
  renderAdminInventory();
  document.getElementById('adminInventoryModal').classList.remove('hidden');
}

function renderAdminInventory() {
  const v = DB.users.find(u => u.id === _invVendorId); if (!v) return;
  const items = v.items || [];
  const el = document.getElementById('aInvList');

  if (!items.length) {
    el.innerHTML = '<div style="text-align:center;padding:30px;color:var(--gy)">No items yet</div>';
    return;
  }

  el.innerHTML = items.map(item => `
    <div style="display:flex;align-items:center;gap:10px;padding:10px;background:#fff;border-radius:var(--r12);border:1px solid var(--lt);margin-bottom:8px">
      ${item.image ? `<img src="${item.image}" style="width:48px;height:48px;border-radius:var(--r8);object-fit:cover;flex-shrink:0">` :
      `<div style="width:48px;height:48px;border-radius:var(--r8);background:var(--og);display:flex;align-items:center;justify-content:center;font-size:1.4rem;flex-shrink:0">${item.emoji}</div>`}
      <div style="flex:1;min-width:0">
        <div style="font-weight:600;font-size:.86rem">${item.name}</div>
        <div style="font-size:.72rem;color:var(--gy)">₹${item.price} · ${item.unit}${item.desc ? ' · ' + item.desc : ''}</div>
        <div style="font-size:.65rem;font-weight:700;color:${item.avail ? 'var(--gl)' : 'var(--rd)'}">${item.avail ? '✓ Available' : '✕ Out of Stock'}</div>
      </div>
      <button class="oa-btn" style="font-size:.7rem;padding:4px 8px" onclick="adminToggleItemAvail('${item.id}')">${item.avail ? '🚫' : '✅'}</button>
      <button class="oa-btn btn-reject" style="font-size:.7rem;padding:4px 8px" onclick="adminDeleteItem('${item.id}')">🗑️</button>
    </div>
  `).join('');
}

function adminToggleItemAvail(itemId) {
  const v = DB.users.find(u => u.id === _invVendorId); if (!v) return;
  const item = (v.items || []).find(i => i.id === itemId); if (!item) return;
  item.avail = !item.avail;
  if (db) db.collection('users').doc(v.id).update({items: v.items});
  else saveDB();
  renderAdminInventory();
  logAudit('admin_toggle_item', v.id, `${item.name} → ${item.avail ? 'available' : 'out of stock'}`);
}

function adminDeleteItem(itemId) {
  if (!confirm('Delete this item?')) return;
  const v = DB.users.find(u => u.id === _invVendorId); if (!v) return;
  v.items = (v.items || []).filter(i => i.id !== itemId);
  if (db) db.collection('users').doc(v.id).update({items: v.items});
  else saveDB();
  renderAdminInventory();
  logAudit('admin_delete_item', v.id, 'Admin removed item');
}

// ═══ COMMS LOG ═══
async function loadRecentComms(targetId, limit = 5) {
  const el = document.getElementById(targetId); if (!el) return;
  let logs = [];
  try {
    if (db && navigator.onLine) {
      const snap = await db.collection('auditLog')
        .where('type', 'in', ['whatsapp_sent', 'sms_sent', 'whatsapp_failed', 'sms_failed'])
        .orderBy('ts', 'desc').limit(limit).get();
      logs = snap.docs.map(d => d.data());
    }
  } catch (e) {
    // Fallback: show from general audit log
    try {
      if (db && navigator.onLine) {
        const snap = await db.collection('auditLog').orderBy('ts', 'desc').limit(20).get();
        logs = snap.docs.map(d => d.data()).filter(l =>
          l.type?.includes('whatsapp') || l.type?.includes('sms')
        ).slice(0, limit);
      }
    } catch(e2) {}
  }

  if (!logs.length) {
    el.innerHTML = 'No communications logged yet. Place an order to see triggers.';
    return;
  }

  el.innerHTML = logs.map(l => {
    const icon = l.type?.includes('whatsapp') ? '💬' : '📱';
    const color = l.type?.includes('failed') ? 'var(--rd)' : 'var(--gl)';
    return `${icon} <span style="color:${color}">${l.type}</span> → ${l.refId} · <span style="color:var(--gy)">${new Date(l.ts).toLocaleString('en-IN')}</span><br>`;
  }).join('');
}
