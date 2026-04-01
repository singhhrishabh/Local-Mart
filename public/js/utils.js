// LocalMart — Utilities

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
function hideAll() { ['authScreen', 'dashScreen', 'riderScreen', 'custScreen', 'detailScreen', 'helpScreen', 'adminScreen'].forEach(hide); }
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
  return h < 12 ? (getLang() === 'hi' ? 'सुप्रभात' : 'Good morning') : h < 17 ? (getLang() === 'hi' ? 'नमस्ते' : 'Good afternoon') : (getLang() === 'hi' ? 'शुभ संध्या' : 'Good evening');
}

/** Generate unique order ID — timestamp-based for true uniqueness */
function orderId() { return 'LM-' + Date.now().toString(36).toUpperCase(); }

/** Calculate delivery fee based on subtotal */
function deliveryFeeForOrder(sub) { return sub >= 299 ? 0 : 40; }

/** Calculate carrier pay based on order total */
function perDeliveryPay(o) { return o.total > 499 ? 80 : o.total > 299 ? 60 : 40; }

/** Order status label mapping */
function statusLabel(s) {
  const m = {
    pending: '⏳ ' + T('pending_orders'),
    vendor_accepted: '✅ ' + T('accept'),
    rider_assigned: '🛵 Carrier Assigned',
    picked_up: '🛵 ' + T('picked_up'),
    delivered: '✓ ' + T('delivered'),
    cancelled: '✕ Cancelled'
  };
  return m[s] || s;
}

// ═══ WhatsApp / SMS Communication Layer (with Audit) ═══

/** Log communication attempt to audit trail */
function logComm(type, phone, message, success = true) {
  const status = success ? 'sent' : 'failed';
  logAudit(`${type}_${status}`, phone, message.slice(0, 120));
}

/** Trigger WhatsApp deep link (works on mobile + desktop) */
function triggerWhatsApp(phone, message) {
  try {
    let p = phone.replace(/[\s\-\(\)]/g, '');
    if (p.startsWith('0')) p = '91' + p.slice(1);
    if (!p.startsWith('91') && !p.startsWith('+91')) p = '91' + p;
    p = p.replace('+', '');
    const url = `https://wa.me/${p}?text=${encodeURIComponent(message)}`;
    window.open(url, '_blank');
    logComm('whatsapp', p, message, true);
  } catch (e) {
    console.error('WhatsApp trigger failed:', e);
    logComm('whatsapp', phone, message + ' [ERROR: ' + e.message + ']', false);
  }
}

/** Trigger SMS via URI scheme (mobile fallback) */
function triggerSMS(phone, message) {
  try {
    let p = phone.replace(/[\s\-\(\)]/g, '');
    if (!p.startsWith('+')) p = '+91' + (p.startsWith('91') ? p.slice(2) : p);
    const url = `sms:${p}?body=${encodeURIComponent(message)}`;
    window.open(url, '_blank');
    logComm('sms', p, message, true);
  } catch (e) {
    console.error('SMS trigger failed:', e);
    logComm('sms', phone, message + ' [ERROR: ' + e.message + ']', false);
  }
}

// ═══ Image Compression (Canvas-based, for 2G/3G) ═══

/** Compress image file to low-res thumbnail, returns Promise<dataURL> */
function compressImage(file, maxWidth = 300, quality = 0.6) {
  return new Promise((res, rej) => {
    const reader = new FileReader();
    reader.onload = e => {
      const img = new Image();
      img.onload = () => {
        const ratio = Math.min(maxWidth / img.width, maxWidth / img.height, 1);
        const canvas = document.createElement('canvas');
        canvas.width = img.width * ratio;
        canvas.height = img.height * ratio;
        const ctx = canvas.getContext('2d');
        ctx.drawImage(img, 0, 0, canvas.width, canvas.height);
        res(canvas.toDataURL('image/webp', quality));
      };
      img.onerror = rej;
      img.src = e.target.result;
    };
    reader.onerror = rej;
    reader.readAsDataURL(file);
  });
}

// ═══ Voice Input (Web Speech API for Hindi) ═══

/** Start voice recognition for Hindi, calls callback(text) on result */
function startVoiceInput(callback) {
  if (!('webkitSpeechRecognition' in window) && !('SpeechRecognition' in window)) {
    toast('Voice input not supported in this browser', 'red'); return;
  }
  const SR = window.SpeechRecognition || window.webkitSpeechRecognition;
  const rec = new SR();
  rec.lang = 'hi-IN';
  rec.interimResults = false;
  rec.maxAlternatives = 1;
  rec.onresult = e => {
    const text = e.results[0][0].transcript;
    callback(text);
    toast('🎤 ' + text, 'blue');
  };
  rec.onerror = () => toast('Voice input failed. Try again.', 'red');
  rec.start();
  toast(T('voice_hint'), 'blue');
}

// ═══ Service Worker Registration ═══
if ('serviceWorker' in navigator) {
  navigator.serviceWorker.register('/sw.js').then(() => console.log('📱 SW registered')).catch(e => console.warn('SW failed:', e));
}
