const CACHE_NAME = 'harmonic-arcade-v1';
const ASSETS_TO_CACHE = [
    '/',
    '/index.html',
    '/flappy.html',
    '/billiards.html',
    '/invaders.html',
    '/weaver.html',
    '/simon.html',
    '/audio.js',
    '/game.js',
    '/theory.js',
    '/manifest.json'
];

// Install Event: Cache the files
self.addEventListener('install', event => {
    event.waitUntil(
        caches.open(CACHE_NAME).then(cache => {
            return cache.addAll(ASSETS_TO_CACHE);
        })
    );
});

// Fetch Event: Serve from cache if offline
self.addEventListener('fetch', event => {
    event.respondWith(
        caches.match(event.request).then(response => {
            return response || fetch(event.request);
        })
    );
});