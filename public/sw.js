self.addEventListener('install', () => self.skipWaiting());

self.addEventListener('activate', (event) => {
    event.waitUntil(
        caches.keys().then((cacheNames) => {
            return Promise.all(
                cacheNames.map((cacheName) => caches.delete(cacheName))
            );
        }).then(() => {
            return self.registration.unregister();
        })
    );
    self.clients.claim();
});

// Always bypass cache and go to network to kill the cache loop
self.addEventListener('fetch', (event) => {
    event.respondWith(fetch(event.request));
});
