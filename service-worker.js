const CACHE_NAME = "skyglobe-github-pages-v4";
const ASSETS = [
  "./",
  "./index.html",
  "./manifest.json",
  "./icon-192.png",
  "./icon-512.png",
  "./icon-192-maskable.png",
  "./icon-512-maskable.png",
  "./splash-final.png",
  "./app-screenshot-portrait.png",
  "./app-screenshot-landscape.png"
];
self.addEventListener("install", (event) => {
  self.skipWaiting();
  event.waitUntil(caches.open(CACHE_NAME).then((cache) => cache.addAll(ASSETS)));
});
self.addEventListener("activate", (event) => {
  event.waitUntil(caches.keys().then((keys) => Promise.all(keys.map((key) => key !== CACHE_NAME ? caches.delete(key) : Promise.resolve()))).then(() => self.clients.claim()));
});
self.addEventListener("fetch", (event) => {
  const req = event.request;
  if (req.method !== "GET") return;
  const url = new URL(req.url);
  if (url.origin !== self.location.origin) return;
  if (req.mode === "navigate") {
    event.respondWith(fetch(req).then((res) => { const clone = res.clone(); caches.open(CACHE_NAME).then((cache) => cache.put(req, clone)); return res; }).catch(() => caches.match(req).then((r) => r || caches.match("./index.html"))));
    return;
  }
  event.respondWith(caches.match(req).then((cached) => cached || fetch(req).then((res) => { const clone = res.clone(); caches.open(CACHE_NAME).then((cache) => cache.put(req, clone)); return res; })));
});
