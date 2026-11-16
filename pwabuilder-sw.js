// Service Worker для офлайн-игры VectorFlux 8x8
const CACHE_NAME = 'vectorflux-cache-v1';
const FILES_TO_CACHE = [
  './index.html',
  './manifest.json',
  './Icon-512.png'
];

// Установка Service Worker и кэширование файлов
self.addEventListener('install', (event) => {
  event.waitUntil(
    caches.open(CACHE_NAME).then((cache) => {
      return cache.addAll(FILES_TO_CACHE);
    })
  );
  self.skipWaiting();
});

// Активация и очистка старого кэша
self.addEventListener('activate', (event) => {
  event.waitUntil(
    caches.keys().then((keyList) => {
      return Promise.all(
        keyList.map((key) => {
          if (key !== CACHE_NAME) {
            return caches.delete(key);
          }
        })
      );
    })
  );
  self.clients.claim();
});

// Перехват запросов и работа в офлайн-режиме
self.addEventListener('fetch', (event) => {
  event.respondWith(
    caches.match(event.request).then((response) => {
      return response || fetch(event.request).catch(() => {
        // Если нет сети и файла нет в кэше (например, внешние запросы)
        return caches.match('./index.html');
      });
    })
  );
});
