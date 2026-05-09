// 更改這個版本號可以強制清除舊快取
const CACHE_NAME = 'music-app-v2'; 
const urlsToCache = [
  './',
  './index.html',
  'https://cdn.jsdelivr.net/npm/vexflow@4.2.2/build/cjs/vexflow.js',
  'https://cdnjs.cloudflare.com/ajax/libs/tone/14.8.49/Tone.js'
];

// 1. 安裝階段：下載並快取檔案
self.addEventListener('install', event => {
  event.waitUntil(
    caches.open(CACHE_NAME).then(cache => cache.addAll(urlsToCache))
  );
  self.skipWaiting(); // 強制新的 Service Worker 立刻接管
});

// 2. 啟動階段：清除舊版本的快取
self.addEventListener('activate', event => {
  event.waitUntil(
    caches.keys().then(cacheNames => {
      return Promise.all(
        cacheNames.map(cacheName => {
          if (cacheName !== CACHE_NAME) {
            console.log('清除舊快取:', cacheName);
            return caches.delete(cacheName);
          }
        })
      );
    })
  );
  self.clients.claim(); // 立刻控制所有開啟的網頁
});

// 3. 攔截請求：網路優先 (Network First)
self.addEventListener('fetch', event => {
  event.respondWith(
    fetch(event.request).then(response => {
        // 如果有網路且抓取成功，順便更新快取裡的檔案
        return caches.open(CACHE_NAME).then(cache => {
            cache.put(event.request, response.clone());
            return response;
        });
    }).catch(() => {
        // 如果「斷網」了 (fetch 失敗)，才從快取裡面拿檔案
        return caches.match(event.request);
    })
  );
});
