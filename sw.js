const CACHE_NAME = "school-connect-tn-v3";

const urlsToCache = [
    "/thirumalvadi-school-connect/",
    "/thirumalvadi-school-connect/index.html",
    "/thirumalvadi-school-connect/style.css",
    "/thirumalvadi-school-connect/firebase.js"
];

// ==========================================
// INSTALL
// ==========================================

self.addEventListener("install", (event) => {

    self.skipWaiting();

    event.waitUntil(

        caches.open(CACHE_NAME)
            .then((cache) => {

                return cache.addAll(urlsToCache);

            })
            .catch((error) => {

                console.error(
                    "Service Worker Cache Error:",
                    error
                );

            })

    );

});

// ==========================================
// ACTIVATE
// ==========================================

self.addEventListener("activate", (event) => {

    event.waitUntil(

        caches.keys().then((keys) => {

            return Promise.all(

                keys.map((key) => {

                    if (key !== CACHE_NAME) {

                        return caches.delete(key);

                    }

                    return null;

                })

            );

        }).then(() => {

            return self.clients.claim();

        })

    );

});

// ==========================================
// FETCH
// ==========================================

self.addEventListener("fetch", (event) => {

    const request = event.request;

    // Only handle GET requests
    if (request.method !== "GET") {

        return;

    }

    const url = new URL(request.url);

    // Do NOT intercept Firebase / external requests
    if (url.origin !== self.location.origin) {

        return;

    }

    event.respondWith(

        fetch(request)

            .then((response) => {

                // Save successful response in cache
                if (response && response.ok) {

                    const responseClone =
                        response.clone();

                    caches.open(CACHE_NAME)
                        .then((cache) => {

                            cache.put(
                                request,
                                responseClone
                            );

                        });

                }

                return response;

            })

            .catch(async () => {

                const cachedResponse =
                    await caches.match(request);

                if (cachedResponse) {

                    return cachedResponse;

                }

                // Always return a valid Response
                return new Response(
                    "Offline - Resource not available",
                    {
                        status: 503,
                        statusText: "Service Unavailable",
                        headers: {
                            "Content-Type":
                                "text/plain; charset=utf-8"
                        }
                    }
                );

            })

    );

});

console.log(
    "School Connect TN Service Worker V3 Loaded"
);
