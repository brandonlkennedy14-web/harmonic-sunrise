// sw.js — Harmonic Arcade Service Worker
// Cache version — bump this string whenever you deploy new files
const CACHE_NAME = 'harmonic-arcade-v3';

// ONLY list files that actually exist on disk.
// audio.js / game.js / theory.js were removed — they were dead references
// that caused the install event to fail silently, breaking offline mode.
const ASSETS_TO_CACHE = [
    '/',
    '/index.html',
    '/flappy.html',
    '/billiards.html',
    '/invaders.html',
    '/weaver.html',
    '/simon.html',
    '/manifest.json',
    '/GenesisBrain.js'
    // Add icon paths once you have them:
    // '/icon-192.png',
    // '/icon-512.png'
];

self.addEventListener('install', event => {
    event.waitUntil(
        caches.open(CACHE_NAME).then(cache => {
            // addAll fails atomically — one 404 kills the whole install.
            // Using a safe loop so a missing icon won't break the PWA.
            return Promise.allSettled(
                ASSETS_TO_CACHE.map(url =>
                    cache.add(url).catch(err =>
                        console.warn(`SW: failed to cache ${url}`, err)
                    )
                )
            );
        })
    );
    // Activate immediately — don't wait for old tabs to close
    self.skipWaiting();
});

self.addEventListener('activate', event => {
    event.waitUntil(
        caches.keys().then(cacheNames =>
            Promise.all(
                cacheNames
                    .filter(name => name !== CACHE_NAME)
                    .map(name => caches.delete(name))
            )
        )
    );
    self.clients.claim();
});

// Cache-first for local assets, network-first for everything else
self.addEventListener('fetch', event => {
    // Only intercept GET requests
    if (event.request.method !== 'GET') return;

    event.respondWith(
        caches.match(event.request).then(cached => {
            if (cached) return cached;
            return fetch(event.request).then(response => {
                // Cache successful responses for our own origin
                if (
                    response.ok &&
                    response.type === 'basic' &&
                    event.request.url.startsWith(self.location.origin)
                ) {
                    const clone = response.clone();
                    caches.open(CACHE_NAME).then(cache =>
                        cache.put(event.request, clone)
                    );
                }
                return response;
            }).catch(() => cached); // offline fallback
        })
    );
});
