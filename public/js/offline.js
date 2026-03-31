// LocalMart — IndexedDB Offline Queue

const IDB_NAME = 'localmart_offline', IDB_VER = 1;
let _idb = null;

/* Open/create IndexedDB */
function openOfflineDB() {
  return new Promise((res, rej) => {
    if (_idb) return res(_idb);
    const req = indexedDB.open(IDB_NAME, IDB_VER);
    req.onupgradeneeded = e => {
      const d = e.target.result;
      if (!d.objectStoreNames.contains('pendingOrders')) d.createObjectStore('pendingOrders', {keyPath: 'id'});
      if (!d.objectStoreNames.contains('thumbnailCache')) d.createObjectStore('thumbnailCache', {keyPath: 'id'});
      if (!d.objectStoreNames.contains('auditLog')) d.createObjectStore('auditLog', {keyPath: 'id'});
    };
    req.onsuccess = e => { _idb = e.target.result; res(_idb); };
    req.onerror = () => rej(req.error);
  });
}

/* Queue an order for later sync */
async function queueOrder(order) {
  const d = await openOfflineDB();
  return new Promise((res, rej) => {
    const tx = d.transaction('pendingOrders', 'readwrite');
    tx.objectStore('pendingOrders').put({...order, queuedAt: Date.now()});
    tx.oncomplete = () => res();
    tx.onerror = () => rej(tx.error);
  });
}

/* Get all pending orders */
async function getPendingOrders() {
  const d = await openOfflineDB();
  return new Promise((res, rej) => {
    const tx = d.transaction('pendingOrders', 'readonly');
    const req = tx.objectStore('pendingOrders').getAll();
    req.onsuccess = () => res(req.result || []);
    req.onerror = () => rej(req.error);
  });
}

/* Remove synced order */
async function removePendingOrder(id) {
  const d = await openOfflineDB();
  return new Promise((res, rej) => {
    const tx = d.transaction('pendingOrders', 'readwrite');
    tx.objectStore('pendingOrders').delete(id);
    tx.oncomplete = () => res();
    tx.onerror = () => rej(tx.error);
  });
}

/* Sync all pending orders to Firestore */
async function syncPendingOrders() {
  if (!navigator.onLine || !db) return;
  const orders = await getPendingOrders();
  if (!orders.length) return;
  let synced = 0;
  for (const o of orders) {
    try {
      o.createdAt = firebase.firestore.FieldValue.serverTimestamp();
      o.syncedFromOffline = true;
      await db.collection('orders').doc(o.id).set(o);
      await removePendingOrder(o.id);
      synced++;
      // Fire WhatsApp notification to vendor
      const vendor = DB.users.find(v => v.id === o.vendorId);
      if (vendor?.phone) triggerWhatsApp(vendor.phone, `New Order ${o.id}: ${o.items.map(i => i.name + ' ×' + i.qty).join(', ')} | Total: ₹${o.total} | Location: ${o.address}`);
      // SMS confirmation to customer
      if (o.phone) triggerSMS(o.phone, `LocalMart: Your order ${o.id} has been placed! Total ₹${o.total}. Cash on Delivery.`);
      // Audit log
      logAudit('order_synced', o.id, `Offline order synced. Vendor: ${o.vendorName}`);
    } catch (e) { console.error('Sync failed for', o.id, e); }
  }
  if (synced) toast(`✅ ${synced} offline order${synced > 1 ? 's' : ''} synced!`, 'green');
}

/* Thumbnail cache for offline browsing */
async function cacheThumbnail(itemId, dataUrl) {
  const d = await openOfflineDB();
  return new Promise((res, rej) => {
    const tx = d.transaction('thumbnailCache', 'readwrite');
    tx.objectStore('thumbnailCache').put({id: itemId, data: dataUrl, cachedAt: Date.now()});
    tx.oncomplete = () => res();
    tx.onerror = () => rej(tx.error);
  });
}

async function getThumbnail(itemId) {
  const d = await openOfflineDB();
  return new Promise((res) => {
    const tx = d.transaction('thumbnailCache', 'readonly');
    const req = tx.objectStore('thumbnailCache').get(itemId);
    req.onsuccess = () => res(req.result?.data || null);
    req.onerror = () => res(null);
  });
}

/* Audit log for admin */
async function logAudit(type, refId, detail) {
  try {
    const entry = {id: 'audit_' + Date.now() + '_' + Math.random().toString(36).slice(2, 6), type, refId, detail, ts: Date.now()};
    if (db && navigator.onLine) { await db.collection('auditLog').doc(entry.id).set(entry); }
    else { const d = await openOfflineDB(); const tx = d.transaction('auditLog', 'readwrite'); tx.objectStore('auditLog').put(entry); }
  } catch (e) {}
}

/* Latency watchdog — wraps a promise with a timeout */
function withLatencyGuard(promise, timeoutMs = 10000) {
  return new Promise((res, rej) => {
    let done = false;
    const timer = setTimeout(() => { if (!done) { done = true; rej(new Error('LATENCY_TIMEOUT')); } }, timeoutMs);
    promise.then(v => { if (!done) { done = true; clearTimeout(timer); res(v); } }).catch(e => { if (!done) { done = true; clearTimeout(timer); rej(e); } });
  });
}

/* Auto-sync on reconnect */
window.addEventListener('online', () => { toast('Back online! Syncing...', 'green'); syncPendingOrders(); });
// Listen for SW sync messages
navigator.serviceWorker?.addEventListener('message', e => { if (e.data?.type === 'SYNC_ORDERS') syncPendingOrders(); });
// Init DB on load
openOfflineDB();
