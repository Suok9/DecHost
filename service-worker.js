const CACHE_NAME = "fidex-cache-v3";
const BASE_PATH = "/DecHost/";

self.addEventListener("install", event => {
    event.waitUntil(
        caches.open(CACHE_NAME).then(cache => {
            return cache.addAll([
                BASE_PATH,
                BASE_PATH + "index.html",
                BASE_PATH + "admin.html",
                BASE_PATH + "style.css",
                BASE_PATH + "main.js",
                BASE_PATH + "logo.png",
                BASE_PATH + "manifest.json"
            ]);
        })
    );
    self.skipWaiting();
});

self.addEventListener("activate", event => {
    event.waitUntil(
        caches.keys().then(keys => {
            return Promise.all(
                keys.filter(key => key !== CACHE_NAME)
                .map(key => caches.delete(key))
            );
        })
    );
    self.clients.claim();
});

self.addEventListener("fetch", event => {
    event.respondWith(
        caches.match(event.request).then(response => {
            return response || fetch(event.request);
        })
    );
});