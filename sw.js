const CACHE_NAME = 'praytrack98-v5';
const urlsToCache = [
  './',
  './index.html',
  './demo.html', // <--- TAMBAHIN INI
  './app.js',
  './data/quranData.json',
  './icon-192x192.png',
  './logo-512x512.png',
  './assets/sounds/click.mp3',
  './assets/sounds/chord.mp3',
  './assets/images/ss1.png', // <--- TAMBAHIN GAMBAR BIAR OFFLINE
  './assets/images/ss2.png',
  './assets/images/ss3.png',
  './assets/images/ss4.png',
  './assets/images/ss5.png',
  './assets/images/ss6.png'
];

// Install: Simpan file dasar
self.addEventListener('install', event => {
  event.waitUntil(
    caches.open(CACHE_NAME)
      .then(cache => {
        console.log('Opened cache');
        return cache.addAll(urlsToCache);
      })
  );
  self.skipWaiting(); // Langsung aktif tanpa nunggu tab lama ditutup
});

// Fetch: Ambil dari cache dulu, kalau nggak ada fetch internet terus simpen ke cache
self.addEventListener('fetch', event => {
  event.respondWith(
    caches.match(event.request)
      .then(response => {
        if (response) {
          return response; // Pakai yang offline
        }
        // Fetch dari internet kalau belum ada di cache (misal: modules/sholat.js)
        return fetch(event.request).then(networkResponse => {
          // Jangan cache file dari luar (CDN Tailwind/Google Fonts) biar nggak ribet update
          if (!event.request.url.startsWith(self.location.origin)) {
            return networkResponse;
          }
          // Simpen file baru ke cache biar next time bisa offline
          return caches.open(CACHE_NAME).then(cache => {
            cache.put(event.request.url, networkResponse.clone());
            return networkResponse;
          });
        });
      }
    )
  );
});

// Activate: Bersihin cache versi lama
self.addEventListener('activate', event => {
  const cacheWhitelist = [CACHE_NAME];
  event.waitUntil(
    caches.keys().then(cacheNames => {
      return Promise.all(
        cacheNames.map(cacheName => {
          if (cacheWhitelist.indexOf(cacheName) === -1) {
            return caches.delete(cacheName);
          }
        })
      );
    })
  );
  self.clients.claim(); // Ambil alih kendali halaman langsung
});
