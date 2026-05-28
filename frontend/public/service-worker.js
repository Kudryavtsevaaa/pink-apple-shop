/* eslint-disable no-restricted-globals */

const CACHE_NAME = 'pink-apple-shop-v1';
const urlsToCache = [
  '/',
  '/index.html',
  '/static/js/main.*.js',
  '/static/css/main.*.css',
  '/logo192.png',
  '/logo512.png',
  '/favicon.ico',
  '/manifest.json'
];

// Установка service worker
self.addEventListener('install', (event) => {
  console.log('[SW] Установка service worker...');
  event.waitUntil(
    caches.open(CACHE_NAME)
      .then((cache) => {
        console.log('[SW] Кэш открыт');
        return cache.addAll(urlsToCache);
      })
      .catch((error) => {
        console.error('[SW] Ошибка кэширования:', error);
      })
  );
});

// Активация service worker
self.addEventListener('activate', (event) => {
  console.log('[SW] Активация service worker...');
  const cacheWhitelist = [CACHE_NAME];
  event.waitUntil(
    caches.keys().then((cacheNames) => {
      return Promise.all(
        cacheNames.map((cacheName) => {
          if (cacheWhitelist.indexOf(cacheName) === -1) {
            console.log('[SW] Удаление старого кэша:', cacheName);
            return caches.delete(cacheName);
          }
        })
      );
    })
  );
});

// Перехват запросов
self.addEventListener('fetch', (event) => {
  event.respondWith(
    caches.match(event.request)
      .then((response) => {
        if (response) {
          return response;
        }
        return fetch(event.request).then(
          (response) => {
            if (!response || response.status !== 200 || response.type !== 'basic') {
              return response;
            }
            const responseToCache = response.clone();
            caches.open(CACHE_NAME)
              .then((cache) => {
                cache.put(event.request, responseToCache);
              });
            return response;
          }
        );
      })
      .catch(() => {
        console.log('[SW] Запрос не удался, возвращаем офлайн страницу');
      })
  );
});

// Обработка push уведомлений (опционально)
self.addEventListener('push', (event) => {
  console.log('[SW] Получено push сообщение');
  const options = {
    body: event.data ? event.data.text() : 'Новое уведомление',
    icon: '/logo192.png',
    badge: '/logo192.png',
    vibrate: [100, 50, 100],
    data: {
      dateOfArrival: Date.now(),
      primaryKey: 1
    }
  };
  event.waitUntil(
    self.registration.showNotification('🌸 Розовое яблоко', options)
  );
});