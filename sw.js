const CACHE_NAME = 'praytrack98-v1';
const urlsToCache = [
  './',
  './index.html',
  './app.js',
  './data/quranData.json',
  './icon-192x192.png',
  './icon-512x512.png'
];

// Install: Simpan semua file dasar ke cache
self.addEventListener('install', event => {
  event.waitUntil(
    caches.open(CACHE_NAME)
      .then(cache => {
        console.log('Opened cache');
        return cache.addAll(urlsToCache);
      })
  );
});

// Fetch: Kalau user minta file, cek cache dulu. Kalau ada, pake cache. Kalau nggak, fetch internet.
self.addEventListener('fetch', event => {
  event.respondWith(
    caches.match(event.request)
      .then(response => {
        if (response) {
          return response; // Pakai yang di cache (Offline mode)
        }
        return fetch(event.request); // Ambil dari internet
      }
    )
  );
});

// Activate: Bersihin cache lama kalau ada update
self.addEventListener('activate', event => {
  const cacheWhitelist = [CACHE_NAME];
  event.waitUntil(
    caches.keys().then(cacheNames => {
      return Promise.all(
        cacheNames.map(cacheName => {
          if (cacheWhitelist.indexOf(cacheName) === -1) {
            return caches.delete(cacheName); // Hapus cache versi lama
          }
        })
      );
    })
  );
});
