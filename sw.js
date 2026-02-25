// Keke's International Food Spot — Service Worker
const CACHE_NAME = 'kekes-v1';
const ASSETS = [
  '/kekesinternational.html',
  '/kekesinternational-menu.html',
  '/kekesinternational-checkout.html',
  '/kekesinternational-tracker.html',
  '/kekesinternational-catering.html',
  '/kekesinternational-events.html',
  '/kekesinternational-about.html',
  '/kekesinternational-gallery.html',
  '/kekesinternational-vip.html',
  '/kekesinternational-faq.html',
  '/kekesinternational-contact.html',
  '/manifest.json'
];

// Install — cache all pages
self.addEventListener('install', e => {
  e.waitUntil(
    caches.open(CACHE_NAME).then(cache => {
      return cache.addAll(ASSETS).catch(() => {});
    })
  );
  self.skipWaiting();
});

// Activate — clean old caches
self.addEventListener('activate', e => {
  e.waitUntil(
    caches.keys().then(keys =>
      Promise.all(keys.filter(k => k !== CACHE_NAME).map(k => caches.delete(k)))
    )
  );
  self.clients.claim();
});

// Fetch — serve from cache, fallback to network
self.addEventListener('fetch', e => {
  e.respondWith(
    caches.match(e.request).then(cached => {
      return cached || fetch(e.request).then(response => {
        if (response && response.status === 200) {
          const clone = response.clone();
          caches.open(CACHE_NAME).then(cache => cache.put(e.request, clone));
        }
        return response;
      }).catch(() => cached);
    })
  );
});
