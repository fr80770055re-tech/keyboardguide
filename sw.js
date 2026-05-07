const CACHE_NAME = 'music-app-v1';
const urlsToCache = [
  './',
  './index.html',
  // 快取我們依賴的外部套件，這樣沒網路也能載入！
  'https://cdn.jsdelivr.net/npm/vexflow@4.2.2/build/cjs/vexflow.js',
  'https://cdnjs.cloudflare.com/ajax/libs/tone/14.8.49/Tone.js'
];

// 安裝階段：將指定的檔案加入快取
self.addEventListener('install', event => {
  event.waitUntil(
    caches.open(CACHE_NAME)
      .then(cache => {
        console.log('Opened cache');
        return cache.addAll(urlsToCache);
      })
  );
});

// 攔截網路請求：如果有快取就用快取，沒有就透過網路抓
self.addEventListener('fetch', event => {
  event.respondWith(
    caches.match(event.request)
      .then(response => {
        // 如果在快取中找到匹配的檔案，就直接回傳快取檔案 (離線可用)
        if (response) {
          return response;
        }
        return fetch(event.request);
      })
  );
});
