const cacheName = 'my-cache-v1';
const resourcesToCache = [
    '/',
    '/index.html',
    '/styles.css',
    '/styles1.js',
    '/help.html',
    '/help.css',
    '/details.html',
    '/details.css',
    '/ar.html',
    '/banner.png',
    '/operator.png',
    'https://cdn.emailjs.com/dist/email.min.js',
    'https://unpkg.com/leaflet/dist/leaflet.css',
    'https://unpkg.com/leaflet/dist/leaflet.js',
    'https://aframe.io/releases/0.9.2/aframe.min.js',
    'https://raw.githack.com/jeromeetienne/AR.js/master/aframe/build/aframe-ar.min.js'
];

self.addEventListener('install', (event) => {
    event.waitUntil(
        caches.open(cacheName)
            .then((cache) => {
                return cache.addAll(resourcesToCache);
            })
            .catch((error) => {
                console.error('Failed to cache resources:', error);
            })
    );
});
