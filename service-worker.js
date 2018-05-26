var CACHE_NAME = 'my-site-cache-v2';
var urlsToCache = [
    '/main.css',
    '/scripts/app.js',
    '/manifest.json',
    '/images/Yahoo192.png',
    '/images/Yahoo512.png',
    '/service-worker.js',
];

self.addEventListener('install', function(event) {
    // Perform install steps
    event.waitUntil(
        caches.open(CACHE_NAME)
            .then(function(cache) {
                console.log('Opened cache');
                return cache.addAll(urlsToCache);
            })
    );
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

