// Lekgympan: hämtar alltid senaste versionen när nätet finns, och visar sparad version utan nät.
// Egen cache och eget scope (/leo/), skild från Läxgympans.
const CACHE = 'lekgympan-v1';
self.addEventListener('install', e => { self.skipWaiting(); e.waitUntil(caches.open(CACHE).then(c => c.addAll(['./', './manifest.webmanifest', './icon-192.png']).catch(() => {}))); });
self.addEventListener('activate', e => { e.waitUntil(self.clients.claim()); });
self.addEventListener('fetch', e => {
  const req = e.request;
  if (req.method !== 'GET' || new URL(req.url).origin !== self.location.origin) return;
  e.respondWith(fetch(req).then(res => { const kopia = res.clone(); caches.open(CACHE).then(c => c.put(req, kopia)); return res; }).catch(() => caches.match(req).then(r => r || caches.match('./'))));
});
