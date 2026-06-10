const CACHE_NAME='skyglobe-github-pages-v1';
const ASSETS=['./','./index.html','./manifest.json','./icon-192.png','./icon-512.png','./splash-final.png'];
self.addEventListener('install',e=>{self.skipWaiting();e.waitUntil(caches.open(CACHE_NAME).then(c=>c.addAll(ASSETS)))});
self.addEventListener('activate',e=>{e.waitUntil(caches.keys().then(keys=>Promise.all(keys.map(k=>k!==CACHE_NAME?caches.delete(k):Promise.resolve()))).then(()=>self.clients.claim()))});
self.addEventListener('fetch',e=>{if(e.request.method!=='GET')return;e.respondWith(fetch(e.request).then(r=>{const clone=r.clone();caches.open(CACHE_NAME).then(c=>c.put(e.request,clone)).catch(()=>{});return r;}).catch(()=>caches.match(e.request).then(r=>r||caches.match('./index.html'))))});
