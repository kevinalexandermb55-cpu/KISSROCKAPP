const CACHE_NAME = 'kiss-rock-player-lite-v3';
const INDEX_URL = new URL('./index.html', self.registration.scope).href;
const CORE_ASSETS = [
  './', './index.html', './styles.css', './app.js', './manifest.webmanifest',
  './kiss-logo.png', './kiss-destroyer.jpg', './kiss-record.jpg',
  './paul-stanley.png', './gene-simmons.png', './ace-frehley.png', './peter-criss.png',
  './app-icons/apple-touch-icon.png', './app-icons/favicon-64.png',
  './app-icons/kiss-destroyer-192.png', './app-icons/kiss-destroyer-512.png',
  './app-icons/kiss-destroyer-maskable-512.png',
  './gallery/dynasty-cover.jpeg', './gallery/destroyer-cover.jpeg',
  './gallery/rock-and-roll-over-cover.jpeg', './gallery/psycho-circus-cover.jpeg',
  './gallery/dressed-to-kill-cover.jpeg', './gallery/kiss-debut-cover.jpeg',
  './gallery/sonic-boom-cover.jpeg', './gallery/monster-cover.jpeg',
  './gallery/love-gun-cover.jpeg',
  './gallery/kiss-alive-concert.jpg',
  './loading/letter-k.jpg', './loading/letter-i.jpg',
  './loading/letter-s-one.jpg', './loading/letter-s-two.jpg',
  './favorites/I Was Made For Lovin_ You(MP3_160K).mp3',
  './favorites/KISS Rock And Roll All Nite(MP3_160K).mp3',
  './favorites/Hard Luck Woman(MP3_160K).mp3',
  './favorites/Shock Me(MP3_160K).mp3',
  './favorites/Detroit Rock City(MP3_160K).mp3'
];

self.addEventListener('install', event => {
  event.waitUntil(caches.open(CACHE_NAME).then(cache => cache.addAll(CORE_ASSETS)).then(() => self.skipWaiting()));
});

self.addEventListener('activate', event => {
  event.waitUntil(caches.keys().then(keys => Promise.all(keys.filter(key => key !== CACHE_NAME).map(key => caches.delete(key)))).then(() => self.clients.claim()));
});

self.addEventListener('fetch', event => {
  const request = event.request;
  if (request.method !== 'GET' || new URL(request.url).origin !== self.location.origin) return;
  if (request.mode === 'navigate') {
    event.respondWith(fetch(request).then(response => {
      const copy = response.clone();
      caches.open(CACHE_NAME).then(cache => cache.put(INDEX_URL, copy));
      return response;
    }).catch(() => caches.match(INDEX_URL)));
    return;
  }
  event.respondWith(caches.match(request).then(cached => cached || fetch(request).then(response => {
    if (response.ok) caches.open(CACHE_NAME).then(cache => cache.put(request, response.clone()));
    return response;
  })));
});
