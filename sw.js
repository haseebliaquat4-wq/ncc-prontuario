/* sw.js — v3: avvio veloce + offline vero
   - PRECACHE: app, dati, Leaflet → l'app parte anche senza rete
   - TILE mappa: cache-first (i posti già visti si ricaricano all'istante, anche offline)
   - resto: stale-while-revalidate (risposta subito dalla cache, aggiornamento in background) */

const CACHE_NAME = 'ncc-v57';
const TILE_CACHE = 'ncc-tiles-v3';/* v2: cambiato fornitore mappe, i vecchi riquadri avevano la filigrana */
const TILE_LIMIT = 600; /* massimo tile salvati (≈30-40 MB) */

const PRECACHE = [
  './',
  './index.html',
  './styles.css?v=21',
  './addon.js?v=51',
  './icon-512.png',
  './favicon.svg',
  './app.js?v=3',
  './quiz-data.js?v=2',
  './luoghi-data.js?v=2',
  './manifest.json',
  './icon-192.png',
  'https://unpkg.com/leaflet@1.9.4/dist/leaflet.css',
  'https://unpkg.com/leaflet@1.9.4/dist/leaflet.js',
  'https://unpkg.com/leaflet-polylinedecorator/dist/leaflet.polylinedecorator.js'
];

self.addEventListener('install', event => {
  event.waitUntil(
    caches.open(CACHE_NAME)
      .then(cache => Promise.allSettled(PRECACHE.map(u => cache.add(u))))
      .then(() => self.skipWaiting())
  );
});

self.addEventListener('activate', event => {
  event.waitUntil(
    caches.keys().then(keys => Promise.all(
      keys.filter(k => k !== CACHE_NAME && k !== TILE_CACHE).map(k => caches.delete(k))
    )).then(() => self.clients.claim())
    .then(() => self.clients.matchAll({type:'window'}).then(cs => cs.forEach(c => c.postMessage({t:'sw-updated', v:CACHE_NAME}))))
  );
});

/* mantiene la cache dei tile entro il limite (rimuove i più vecchi) */
async function trimTiles() {
  try {
    const cache = await caches.open(TILE_CACHE);
    const keys = await cache.keys();
    if (keys.length > TILE_LIMIT) {
      const excess = keys.length - TILE_LIMIT;
      for (let i = 0; i < excess; i++) await cache.delete(keys[i]);
    }
  } catch (e) {}
}

self.addEventListener('fetch', event => {
  const req = event.request;
  if (req.method !== 'GET') return; /* mai intercettare POST (Firebase ecc.) */
  const url = new URL(req.url);

  /* Firebase / realtime: sempre rete, mai cache */
  if (url.hostname.includes('firebase') || url.hostname.includes('gstatic') || url.hostname.includes('firebaseio')) return;

  /* TILE mappa: cache-first — velocissimi e disponibili offline */
  if (url.hostname.endsWith('basemaps.cartocdn.com')
      || url.hostname.endsWith('tile.openstreetmap.org')
      || url.hostname.endsWith('server.arcgisonline.com')) {
    event.respondWith(
      caches.open(TILE_CACHE).then(cache =>
        cache.match(req).then(hit => {
          if (hit) return hit;
          return fetch(req).then(res => {
            if (res && (res.ok || res.type === 'opaque')) { cache.put(req, res.clone()); trimTiles(); } /* [FIX] i tile cross-origin sono 'opaque': prima venivano scartati e offline la mappa era bianca */
            return res;
          }).catch(() => hit);
        })
      )
    );
    return;
  }

  /* tutto il resto: stale-while-revalidate — risposta immediata, aggiornamento dietro */
  event.respondWith(
    caches.open(CACHE_NAME).then(cache =>
      cache.match(req).then(hit => {
        const net = fetch(req).then(res => {
          if (res && res.ok && (url.origin === location.origin || url.hostname === 'unpkg.com')) {
            cache.put(req, res.clone());
          }
          return res;
        }).catch(() => hit);
        return hit || net;
      })
    )
  );
});
