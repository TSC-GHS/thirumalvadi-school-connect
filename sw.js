const CACHE_NAME = "school-connect-tn-v2";

const urlsToCache = [
  "/thirumalvadi-school-connect/",
  "/thirumalvadi-school-connect/index.html",
  "/thirumalvadi-school-connect/style.css",
  "/thirumalvadi-school-connect/firebase.js"
];

self.addEventListener("install",(event)=>{

self.skipWaiting();

event.waitUntil(

caches.open(CACHE_NAME).then((cache)=>{

return cache.addAll(urlsToCache);

})

);

});

self.addEventListener("activate",(event)=>{

event.waitUntil(

caches.keys().then((keys)=>{

return Promise.all(

keys.map((key)=>{

if(key!==CACHE_NAME){

return caches.delete(key);

}

})

);

})

);

self.clients.claim();

});

self.addEventListener("fetch",(event)=>{

event.respondWith(

fetch(event.request)

.catch(()=>caches.match(event.request))

);

});
