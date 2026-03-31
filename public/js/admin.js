
const ADMIN_EMAIL = 'admin@localmart.in';
let adminPanel = 'aDash';

function isAdmin(user) { return user?.email === ADMIN_EMAIL; }

function initAdmin() {
  showAdminPanel('aDash');
  document.getElementById('adminWho').textContent = 'Super Admin\n' + ADMIN_EMAIL;
  renderAdminDash();
}

function showAdminPanel(panel) {
  adminPanel = panel;
  ['aDash','aVendors','aCustomers','aCarriers','aOrders','aAudit'].forEach(p => {
    const el = document.getElementById('panel_' + p); if (el) el.classList.toggle('hidden', p !== panel);
  });
  document.querySelectorAll('#adminScreen .sbn[data-ap]').forEach(b => b.classList.toggle('act', b.dataset.ap === panel));
  if (panel === 'aDash') renderAdminDash();
  if (panel === 'aVendors') renderAdminVendors();
  if (panel === 'aCustomers') renderAdminCustomers();
  if (panel === 'aCarriers') renderAdminCarriers();
  if (panel === 'aOrders') renderAdminOrders();
  if (panel === 'aAudit') renderAdminAudit();
}

function aMobNav(panel, btn) {
  document.querySelectorAll('#adminBnav .bni').forEach(b => b.classList.remove('act'));
  btn.classList.add('act'); showAdminPanel(panel);
}
function renderAdminDash() {
  const v = getVendors().length, c = DB.users.filter(u => u.role === 'customer').length;
  const r = getRiders().length, o = DB.orders.length;
  const lv = getLive().length, delivered = DB.orders.filter(o => o.status === 'delivered').length;
  const pending = DB.orders.filter(o => o.status === 'pending').length;
  document.getElementById('admin_dash_content').innerHTML = `
    <div class="stats-row" style="grid-template-columns:repeat(auto-fill,minmax(130px,1fr))">
      <div class="st"><div class="st-v c-o">${v}</div><div class="st-l">Vendors</div></div>
      <div class="st"><div class="st-v c-g">${c}</div><div class="st-l">Customers</div></div>
      <div class="st"><div class="st-v c-b">${r}</div><div class="st-l">Carriers</div></div>
      <div class="st"><div class="st-v" style="color:var(--p)">${o}</div><div class="st-l">Total Orders</div></div>
      <div class="st"><div class="st-v c-g">${lv}</div><div class="st-l">Live Now</div></div>
      <div class="st"><div class="st-v c-g">${delivered}</div><div class="st-l">Delivered</div></div>
      <div class="st"><div class="st-v c-r">${pending}</div><div class="st-l">Pending</div></div>
    </div>
    <div class="card"><div class="card-h">📊 System Health</div>
      <div style="font-size:.82rem;line-height:2;color:var(--gy)">
        🟢 Firebase Connected<br>
        📦 Offline DB: ${_idb ? 'Ready' : 'Initializing'}<br>
        🌐 Status: ${navigator.onLine ? 'Online' : '⚠️ Offline'}<br>
        🗺️ Region: Pratapgarh & Jaunpur
      </div>
    </div>`;
}
function renderAdminVendors() {
  const el = document.getElementById('admin_vendors_content');
  const vendors = getVendors();
  el.innerHTML = vendors.map(v => `
    <div class="order-card">
      <div class="oc-top">
        <div><div class="oc-id">${v.bizName || v.fname}</div><div class="oc-cust">${v.email} · ${v.phone || 'N/A'}</div></div>
        <div class="oc-status ${v.isLive ? 's-delivered' : 's-cancelled'}">${v.isLive ? '🟢 Live' : '⚫ Offline'}</div>
      </div>
      <div class="oc-items">${v.category?.split('|')[1] || ''} · ${(v.items || []).length} items · 📍${v.address || 'N/A'}</div>
      <div class="oc-actions" style="margin-top:8px">
        <button class="oa-btn btn-reject" onclick="adminDeleteUser('${v.id}')">🗑️ Delete</button>
        <button class="oa-btn btn-accept" onclick="adminToggleLive('${v.id}')">${v.isLive ? '⏸ Take Offline' : '▶ Go Live'}</button>
      </div>
    </div>`).join('') || '<div style="text-align:center;padding:40px;color:var(--gy)">No vendors</div>';
}
function renderAdminCustomers() {
  const el = document.getElementById('admin_customers_content');
  const customers = DB.users.filter(u => u.role === 'customer');
  el.innerHTML = customers.map(c => `
    <div class="order-card">
      <div class="oc-top">
        <div><div class="oc-id">${c.fname} ${c.lname}</div><div class="oc-cust">${c.email} · ${c.phone || 'N/A'}</div></div>
      </div>
      <div class="oc-items">Orders: ${DB.orders.filter(o => o.customerId === c.id).length}</div>
      <div class="oc-actions" style="margin-top:8px">
        <button class="oa-btn btn-reject" onclick="adminDeleteUser('${c.id}')">🗑️ Delete</button>
      </div>
    </div>`).join('') || '<div style="text-align:center;padding:40px;color:var(--gy)">No customers</div>';
}
function renderAdminCarriers() {
  const el = document.getElementById('admin_carriers_content');
  const riders = getRiders();
  el.innerHTML = riders.map(r => `
    <div class="order-card">
      <div class="oc-top">
        <div><div class="oc-id">${r.fname} ${r.lname}</div><div class="oc-cust">${r.email} · ${r.phone || 'N/A'}</div></div>
        <div class="oc-status ${r.isLive ? 's-delivered' : 's-cancelled'}">${r.isLive ? '🟢 On Route' : '⚫ Off Duty'}</div>
      </div>
      <div class="oc-items">Route: ${r.routeFrom || '?'} → ${r.routeTo || '?'} · Deliveries: ${r.deliveries || 0} · Earned: ₹${r.earnings || 0}</div>
      <div class="oc-actions" style="margin-top:8px">
        <button class="oa-btn btn-reject" onclick="adminDeleteUser('${r.id}')">🗑️ Delete</button>
      </div>
    </div>`).join('') || '<div style="text-align:center;padding:40px;color:var(--gy)">No carriers</div>';
}
function renderAdminOrders() {
  const el = document.getElementById('admin_orders_content');
  const ts = dt => dt && dt.toMillis ? dt.toMillis() : dt || 0;
  const orders = [...DB.orders].sort((a, b) => ts(b.createdAt) - ts(a.createdAt));
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
  }).join('') || '<div style="text-align:center;padding:40px;color:var(--gy)">No orders yet</div>';
}
async function renderAdminAudit() {
  const el = document.getElementById('admin_audit_content');
  let logs = [];
  try {
    if (db && navigator.onLine) {
      const snap = await db.collection('auditLog').orderBy('ts', 'desc').limit(50).get();
      logs = snap.docs.map(d => d.data());
    }
  } catch (e) {}
  if (!logs.length) { el.innerHTML = '<div style="text-align:center;padding:40px;color:var(--gy)">No audit entries yet. Activity will appear here as orders flow through the system.</div>'; return; }
  el.innerHTML = logs.map(l => `
    <div style="background:#fff;border-radius:var(--r12);padding:10px 14px;margin-bottom:6px;border:1px solid var(--lt);font-size:.78rem">
      <b>${l.type}</b> · ${l.refId}<br><span style="color:var(--gy)">${l.detail} · ${new Date(l.ts).toLocaleString('en-IN')}</span>
    </div>`).join('');
}
function adminDeleteUser(uid) {
  if (!confirm('Delete this user permanently?')) return;
  if (db) db.collection('users').doc(uid).delete();
  toast('User deleted', 'red');
  logAudit('user_deleted', uid, 'Admin deleted user');
  setTimeout(() => { if (adminPanel === 'aVendors') renderAdminVendors(); if (adminPanel === 'aCustomers') renderAdminCustomers(); if (adminPanel === 'aCarriers') renderAdminCarriers(); }, 800);
}

function adminToggleLive(uid) {
  const u = DB.users.find(x => x.id === uid); if (!u) return;
  if (db) db.collection('users').doc(uid).update({isLive: !u.isLive});
  logAudit('admin_toggle_live', uid, `Set ${u.bizName} to ${u.isLive ? 'offline' : 'live'}`);
  setTimeout(() => renderAdminVendors(), 800);
}

function adminDeleteOrder(oid) {
  if (!confirm('Delete this order?')) return;
  if (db) db.collection('orders').doc(oid).delete();
  toast('Order deleted', 'red');
  logAudit('order_deleted', oid, 'Admin deleted order');
  setTimeout(() => renderAdminOrders(), 800);
}

function adminForceDeliver(oid) {
  if (db) db.collection('orders').doc(oid).update({status: 'delivered', deliveredAt: Date.now()});
  toast('Order force-delivered', 'green');
  logAudit('order_force_delivered', oid, 'Admin force-delivered');
  setTimeout(() => renderAdminOrders(), 800);
}
