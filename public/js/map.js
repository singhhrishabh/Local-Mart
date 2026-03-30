// ═══════════════════════════════════════════════════════
// LocalMart — Map Rendering (LeafletJS)
// ═══════════════════════════════════════════════════════

let mapInstance = null;
let mapMarkers = [];
let routePolyline = null;

// LUCKNOW BASE COORDINATES
const BASE_LAT = 26.8467;
const BASE_LNG = 80.9462;

// Scaling SVG X/Y to Geographic Lat/Lng
// X ranges 0-300, Y ranges 0-200. Centered around mapX=150, mapY=100
function convertToLatLng(mapX, mapY) {
  const lat = BASE_LAT - (mapY - 100) * 0.0003;
  const lng = BASE_LNG + (mapX - 150) * 0.0004;
  return [lat, lng];
}

function initMap() {
  if (mapInstance) return; // Already initialized
  
  const mapEl = document.getElementById('liveMap');
  if (!mapEl) return;

  // Initialize Map
  mapInstance = L.map('liveMap', {
    zoomControl: false,
    maxBounds: [
      [26.75, 80.85], // South West
      [26.95, 81.05]  // North East
    ],
    maxBoundsViscosity: 0.8,
    minZoom: 12
  }).setView([BASE_LAT, BASE_LNG], 13);

  // Custom Zoom Control position
  L.control.zoom({ position: 'bottomright' }).addTo(mapInstance);

  // OpenStreetMap Minimalist Tiles
  L.tileLayer('https://{s}.basemaps.cartocdn.com/rastertiles/voyager/{z}/{x}/{y}{r}.png', {
    attribution: '&copy; OpenStreetMap &copy; CARTO'
  }).addTo(mapInstance);
}

function createCustomIcon(v) {
  const isS = v.type === 'service', isF = v.type === 'food';
  const color = v.isLive ? (isS ? '#185ADB' : isF ? '#B5451B' : '#28A05A') : '#888';
  const iconEmoji = isS ? '⚙' : isF ? 'f' : 's';
  const labelText = (v.bizName || '').split(' ')[0].substring(0, 6);

  const htmlNode = `
    <style>@keyframes pulseRing { 0%{transform:scale(0.8); opacity:0.8} 100%{transform:scale(1.8); opacity:0} }</style>
    <div style="position:relative; width:40px; text-align:center;">
      ${v.isLive ? `<div style="position:absolute; top:7px; left:50%; width:30px; height:30px; margin-left:-15px; border-radius:50%; border:1.5px solid ${color}; opacity:0.4; animation: pulseRing 1.5s infinite"></div>` : ''}
      <div style="width:20px; height:20px; background:${color}; border:2px solid #fff; border-radius:50%; margin: 6px auto; display:flex; align-items:center; justify-content:center; color:#fff; font-size:10px; font-weight:bold; box-shadow:0 2px 4px rgba(0,0,0,0.1); z-index:2; position:relative;">
        ${iconEmoji}
      </div>
      <div style="font-size:10px; font-weight:800; font-family:'Syne', sans-serif; color:${v.isLive ? color : '#777'}; text-shadow:1px 1px 0 #fff, -1px -1px 0 #fff, 1px -1px 0 #fff, -1px 1px 0 #fff;">
        ${labelText}
      </div>
    </div>
  `;

  return L.divIcon({ html: htmlNode, className: '', iconSize: [40, 40], iconAnchor: [20, 20] });
}

function renderMapSVG(svcOnly = false) {
  if (!document.getElementById('liveMap')) return;
  initMap();

  const allV = getVendors().filter(v => svcOnly ? v.type === 'service' : v.type !== 'service');
  const liveR = getLiveRiders();

  // Clear existing markers
  mapMarkers.forEach(m => mapInstance.removeLayer(m));
  mapMarkers = [];

  // Plot 'YOU' Marker
  const youIcon = L.divIcon({
    html: `
      <div style="position:relative; text-align:center; width:40px;">
        <div style="width:18px; height:18px; background:#1A6BFF; border:3px solid rgba(26,107,255,0.2); border-radius:50%; box-shadow:0 0 0 2px #fff; margin:0 auto; display:flex; align-items:center; justify-content:center;"></div>
        <div style="font-size:10px; font-weight:bold; color:#1A6BFF; text-shadow:1px 1px 0 #fff, -1px -1px 0 #fff, 1px -1px 0 #fff, -1px 1px 0 #fff; margin-top:2px;">YOU</div>
      </div>
    `, className: '', iconSize: [40, 40], iconAnchor: [20, 20]
  });
  const youMarker = L.marker([BASE_LAT, BASE_LNG], { icon: youIcon }).addTo(mapInstance);
  mapMarkers.push(youMarker);

  // Plot Vendors
  allV.forEach(v => {
    if(!v.mapX || !v.mapY) return;
    const coords = convertToLatLng(v.mapX, v.mapY);
    const m = L.marker(coords, { icon: createCustomIcon(v) })
               .on('click', () => { v.isLive ? openDetail(v.id) : closedToast(v.bizName, v.opensAt); })
               .addTo(mapInstance);
    mapMarkers.push(m);
  });

  // Plot Live Riders
  liveR.forEach(r => {
    if(!r.mapX || !r.mapY) return;
    const coords = convertToLatLng(r.mapX, r.mapY);
    const riderIcon = L.divIcon({
      html: `
        <div style="text-align:center; width:20px;">
          <div style="width:16px; height:16px; background:#F59E0B; border:2px solid #fff; border-radius:50%; font-size:9px; display:flex; align-items:center; justify-content:center; box-shadow:0 2px 5px rgba(0,0,0,0.2); margin:0 auto;">🛵</div>
        </div>
      `, className: '', iconSize: [20, 20], iconAnchor: [10, 10]
    });
    const m = L.marker(coords, { icon: riderIcon, zIndexOffset: 1000 }).addTo(mapInstance);
    mapMarkers.push(m);
  });
}

function renderMapList(svcOnly = false) {
  const live = getLive().filter(v => svcOnly ? v.type === 'service' : v.type !== 'service');
  document.getElementById('mapList').innerHTML = live.map(v => {
    const isS = v.type === 'service', isF = v.type === 'food';
    const cat = v.category?.split('|')[1] || '';
    const emoji = cat.split(' ')[0] || '🏪';
    return `<div class="mvi" onclick="openDetail('${v.id}')">
      <div class="mvi-ic" style="background:${isS ? 'var(--bg)' : isF ? 'var(--fg)' : 'var(--og)'}">${emoji}</div>
      <div style="flex:1;min-width:0"><div class="mvi-nm">${v.bizName}</div><div class="mvi-sub">${cat}</div></div>
      <div style="font-size:.6rem;font-weight:700;padding:2px 7px;border-radius:var(--r100);background:${isS ? 'var(--bg)' : isF ? 'var(--fg)' : 'var(--gg)'};color:${isS ? 'var(--bl)' : isF ? 'var(--fl)' : 'var(--gl)'}">● Live</div>
    </div>`;
  }).join('');
}
