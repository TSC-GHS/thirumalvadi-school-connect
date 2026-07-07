const CACHE_NAME = "school-connect-tn-v1";

const urlsToCache = [
  "/thirumalvadi-school-connect/",
  "/thirumalvadi-school-connect/index.html",
  "/thirumalvadi-school-connect/style.css",
  "/thirumalvadi-school-connect/firebase.js"
];

self.addEventListener("install", (event) => {
  event.waitUntil(
    caches.open(CACHE_NAME).then((cache) => {
      return cache.addAll(urlsToCache);
    })
  );
});

self.addEventListener("fetch", (event) => {
  event.respondWith(
    caches.match(event.request).then((response) => {
      return response || fetch(event.request);
    })
  );
});
