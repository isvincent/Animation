/* 動畫名稱與動畫效果 — Service Worker（離線快取） */
const VERSION = 'anim-styles-v2';
const CORE = [
  './', './index.html', './manifest.webmanifest',
  './css/style.css', './css/demos.css',
  './js/data.js', './js/demos.js', './js/app.js',
  './icons/icon.svg', './icons/icon-192.png', './icons/icon-512.png', './icons/icon-maskable-512.png', './icons/apple-touch-icon.png',
  './assets/thumbs/claude-1.jpg', './assets/thumbs/claude-2.jpg', './assets/thumbs/claude-3.jpg', './assets/thumbs/claude-4.jpg', './assets/thumbs/claude-5.jpg',
  './assets/thumbs/codex-1.jpg', './assets/thumbs/codex-2.jpg', './assets/thumbs/codex-3.jpg', './assets/thumbs/codex-4.jpg', './assets/thumbs/codex-5.jpg', './assets/thumbs/codex-6.jpg',
  './assets/thumbs/antigravity-1.jpg', './assets/thumbs/antigravity-2.jpg', './assets/thumbs/antigravity-3.jpg', './assets/thumbs/antigravity-4.jpg', './assets/thumbs/antigravity-5.jpg'
];

self.addEventListener('install', e => {
  e.waitUntil(caches.open(VERSION).then(c => c.addAll(CORE)).then(() => self.skipWaiting()));
});

self.addEventListener('activate', e => {
  e.waitUntil(caches.keys().then(keys => Promise.all(keys.filter(k => k !== VERSION).map(k => caches.delete(k)))).then(() => self.clients.claim()));
});

self.addEventListener('fetch', e => {
  const req = e.request;
  if (req.method !== 'GET') return;
  const url = new URL(req.url);

  // Google 字型：先用快取，背景更新
  if (url.hostname.endsWith('googleapis.com') || url.hostname.endsWith('gstatic.com')) {
    e.respondWith(caches.open(VERSION).then(async c => {
      const hit = await c.match(req);
      const net = fetch(req).then(r => { if (r.ok || r.type === 'opaque') c.put(req, r.clone()); return r; }).catch(() => hit);
      return hit || net;
    }));
    return;
  }

  if (url.origin !== location.origin) return;

  // 影片：直接走網路（檔案大、且瀏覽器用分段讀取），不放進離線快取
  if (url.pathname.endsWith('.mp4') || req.headers.has('range')) return;

  // 頁面：網路優先，離線時用快取
  if (req.mode === 'navigate') {
    e.respondWith(fetch(req).then(r => { const copy = r.clone(); caches.open(VERSION).then(c => c.put('./index.html', copy)); return r; })
      .catch(() => caches.match('./index.html')));
    return;
  }

  // 其他靜態資源：先回快取（快），同時背景更新（下次開啟就是新版）
  e.respondWith(caches.open(VERSION).then(async c => {
    const hit = await c.match(req);
    const net = fetch(req).then(r => { if (r.ok) c.put(req, r.clone()); return r; }).catch(() => hit);
    return hit || net;
  }));
});
