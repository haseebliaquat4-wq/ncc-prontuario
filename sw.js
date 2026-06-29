/* sw.js — Service Worker per Prontuario NCC Milano
   Strategia: network-first (rete prima, cache come fallback offline).
   Alza CACHE_NAME a ogni rilascio importante per forzare la pulizia. */
const CACHE_NAME = 'ncc-v2';

/* INSTALL: il nuovo SW si attiva subito, senza restare "in attesa".
   È questo che mancava: senza skipWaiting la PWA su iPhone restava
   bloccata sul vecchio SW e quindi sulla versione vecchia dei file. */
self.addEventListener('install', event => {
  self.skipWaiting();
});

/* ACTIVATE: cancella le cache vecchie e prende il controllo delle pagine
   già aperte, così l'aggiornamento ha effetto immediato. */
self.addEventListener('activate', event => {
  event.waitUntil(
    caches.keys()
      .then(keys => Promise.all(
        keys.filter(k => k !== CACHE_NAME).map(k => caches.delete(k))
      ))
      .then(() => self.clients.claim())
  );
});

/* Permette alla pagina di dire al SW "attivati ora" (usato dal pulsante
   "nuova versione disponibile" nell'app, se vorrai collegarlo). */
self.addEventListener('message', event => {
  if (event.data === 'SKIP_WAITING') self.skipWaiting();
});

self.addEventListener('fetch', event => {
  const req = event.request;

  /* Gestiamo solo GET http/https. Le richieste a Firebase (Realtime DB),
     le POST, gli schemi chrome-extension ecc. passano direttamente in rete,
     senza toccare la cache: mettere in cache quelle rompeva il fetch. */
  if (req.method !== 'GET' || !req.url.startsWith('http')) return;

  /* Non intercettare Firebase e le richieste cross-origin di dati:
     vogliamo sempre dati freschi e nessun caching improprio. */
  if (req.url.indexOf('firebaseio.com') !== -1 ||
      req.url.indexOf('firebasedatabase.app') !== -1 ||
      req.url.indexOf('google-analytics') !== -1) {
    return;
  }

  event.respondWith(
    fetch(req)
      .then(networkResponse => {
        /* Mette in cache SOLO risposte valide e complete.
           (status 200, type 'basic' o 'cors' — niente risposte opache/parziali) */
        if (networkResponse && networkResponse.status === 200 &&
            (networkResponse.type === 'basic' || networkResponse.type === 'cors')) {
          const copy = networkResponse.clone();
          caches.open(CACHE_NAME).then(cache => {
            cache.put(req, copy).catch(() => {});
          });
        }
        return networkResponse;
      })
      .catch(() => caches.match(req))
  );
});
