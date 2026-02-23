const CACHE_NAME = 'harmonic-arcade-v2';
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

self.addEventListener('install', event => {
    event.waitUntil(
        caches.open(CACHE_NAME).then(cache => {
            return cache.addAll(ASSETS_TO_CACHE);
        })
    );
});

self.addEventListener('activate', event => {
    event.waitUntil(
        caches.keys().then(cacheNames => {
            return Promise.all(
                cacheNames.map(cache => {
                    if (cache !== CACHE_NAME) {
                        return caches.delete(cache);
                    }
                })
            );
        })
    );
});

self.addEventListener('fetch', event => {
    event.respondWith(
        caches.match(event.request).then(response => {
            return response || fetch(event.request);
        })
    );
});