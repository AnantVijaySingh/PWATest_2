const CACHE_NAME = 'pwa-test-app-v3';
const urlsToCache = [
    '/',
    '/index.html',
    '/main.css',
    '/scripts/app.js',
    '/manifest.json',
    '/images/Yahoo192.png',
    '/images/Yahoo512.png',
];

self.addEventListener('install', function(event) {
    // Perform install steps
    console.log('[ServiceWorker] Install');
    event.waitUntil(
        caches.open(CACHE_NAME)
            .then(function(cache) {
                console.log('[ServiceWorker] Caching app shell');
                return cache.addAll(urlsToCache);
            })
    );
});

self.addEventListener('activate', function(e) {
    console.log('[ServiceWorker] Activate');
    e.waitUntil(
        caches.keys().then(function(keyList) {
            return Promise.all(keyList.map(function(key) {
                if (key !== CACHE_NAME) {
                    console.log('[ServiceWorker] Removing old cache', key);
                    return caches.delete(key);
                }
            }));
        })
    );
    return self.clients.claim();
});


self.addEventListener('fetch', function(event) {
    event.respondWith(
        caches.match(event.request)
            .then(function(response) {
                    // Cache hit - return response
                    if (response) {
                        return response;
                    }
                    return fetch(event.request);
                }
            )
    );
});