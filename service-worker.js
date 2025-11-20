const CACHE_NAME = "jrk-2026-v1";
const ASSETS = [
    "/",
    "/index.html",
    "/style.css",
    "/manifest.json",
    "/icon192.png",
    "/icon512.png",
    "/splash.png",
    "/login.html",
    "/jurnal-harian.html",
    "/offline_ayat.json",
    "/spirit.js",
    "/spirit_pwa_premium.js",
    "/background.svg"
];

// Install Service Worker
self.addEventListener("install", (event) => {
    event.waitUntil(
        caches.open(CACHE_NAME).then((cache) => {
            return cache.addAll(ASSETS);
        })
    );
    self.skipWaiting();
});

// Activate
self.addEventListener("activate", (event) => {
    event.waitUntil(
        caches.keys().then((keys) =>
            Promise.all(
                keys
                    .filter((key) => key !== CACHE_NAME)
                    .map((key) => caches.delete(key))
            )
        )
    );
    self.clients.claim();
});

// Fetch (Offline Mode)
self.addEventListener("fetch", (event) => {
    event.respondWith(
        caches.match(event.request).then((cached) => {
            return (
                cached ||
                fetch(event.request).catch(() =>
                    caches.match("/offline_ayat.json")
                )
            );
        })
    );
});
