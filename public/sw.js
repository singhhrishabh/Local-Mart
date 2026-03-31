// ═══ LocalMart Service Worker — Offline-First PWA ═══
const CACHE = 'lm-v4';
const ASSETS = ['/', '/index.html', '/css/variables.css', '/css/auth.css', '/css/layout.css', '/css/components.css', '/css/customer.css',
  '/js/firebase-config.js', '/js/utils.js', '/js/offline.js', '/js/i18n.js', '/js/data.js', '/js/auth.js', '/js/map.js', '/js/vendor.js', '/js/carrier.js', '/js/customer.js', '/js/admin.js', '/js/app.js'];

self.addEventListener('install', e => e.waitUntil(caches.open(CACHE).then(c => c.addAll(ASSETS)).then(() => self.skipWaiting())));
self.addEventListener('activate', e => e.waitUntil(caches.keys().then(ks => Promise.all(ks.filter(k => k !== CACHE).map(k => caches.delete(k)))).then(() => self.clients.claim())));

self.addEventListener('fetch', e => {
  const u = new URL(e.request.url);
  // Network-first for Firebase API/auth calls
  if (u.hostname.includes('firebaseio') || u.hostname.includes('googleapis') || u.hostname.includes('gstatic') || u.hostname.includes('unpkg')) return;
  e.respondWith(caches.match(e.request).then(r => r || fetch(e.request).then(nr => { if (nr.ok) { const c = nr.clone(); caches.open(CACHE).then(ca => ca.put(e.request, c)); } return nr; }).catch(() => u.pathname.endsWith('.html') || u.pathname === '/' ? caches.match('/index.html') : new Response('Offline', {status: 503}))));
});

// Background sync for offline orders
self.addEventListener('sync', e => { if (e.tag === 'sync-orders') e.waitUntil(self.clients.matchAll().then(cls => cls.forEach(c => c.postMessage({type: 'SYNC_ORDERS'})))); });
