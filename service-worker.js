const CACHE_NAME = 'jrk-premium-v1';
const FILES_TO_CACHE = [
  '/index.html',
  '/jurnal-harian.html',
  '/style.css',
  '/spirit.js',
  '/manifest.json',
  '/icon192.png',
  '/icon512.png',
  '/splash.png'
];

self.addEventListener('install', evt => {
  evt.waitUntil(
    caches.open(CACHE_NAME).then(cache => {
      return cache.addAll(FILES_TO_CACHE);
    })
  );
  self.skipWaiting();
});

self.addEventListener('activate', evt => {
  evt.waitUntil(
    caches.keys().then(keyList => {
      return Promise.all(keyList.map(key => {
        if (key !== CACHE_NAME) return caches.delete(key);
      }));
    })
  );
  self.clients.claim();
});

self.addEventListener('fetch', evt => {
  if (evt.request.mode === 'navigate' || (evt.request.method === 'GET' && evt.request.headers.get('accept').includes('text/html'))) {
    evt.respondWith(
      fetch(evt.request).catch(() => caches.match('/index.html'))
    );
    return;
  }
  evt.respondWith(
    caches.match(evt.request).then(resp => resp || fetch(evt.request))
  );
});
