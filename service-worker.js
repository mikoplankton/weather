const CACHE_NAME = "weather-final-v3";

const urlsToCache = [
  "/",
  "/index.html",
  "/icon-192.png",
  "/icon-512.png"
];

// INSTALL
self.addEventListener("install", e=>{
  self.skipWaiting();
  e.waitUntil(
    caches.open(CACHE_NAME)
      .then(cache=>cache.addAll(urlsToCache))
  );
});

// ACTIVATE
self.addEventListener("activate", e=>{
  e.waitUntil(
    caches.keys().then(keys=>{
      return Promise.all(
        keys.map(key=>{
          if(key !== CACHE_NAME){
            return caches.delete(key);
          }
        })
      );
    })
  );
});

// FETCH (network-first modern)
self.addEventListener("fetch", e=>{
  e.respondWith(
    fetch(e.request)
      .then(res=>{
        const clone = res.clone();
        caches.open(CACHE_NAME).then(cache=>cache.put(e.request, clone));
        return res;
      })
      .catch(()=>caches.match(e.request))
  );
});
