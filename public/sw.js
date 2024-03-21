const CACHE_NAME = "fake-3d-website-cache-v3";

const PRECACHE_URLS = [
    "/models/face_detection/face_detection_short.binarypb",
    "/models/face_detection/face_detection_short_range.tflite",
    "/models/face_detection/face_detection_solution_simd_wasm_bin.js",
    "/models/face_detection/face_detection_solution_simd_wasm_bin.wasm"];

self.addEventListener("install", (event) => {
    console.debug("Service Worker installed");
    event.waitUntil(
        caches.open(CACHE_NAME).then((cache) => {
            return cache.addAll(PRECACHE_URLS);
        })
    );
});

self.addEventListener("fetch", (event) => {
    event.respondWith(
        caches.match(event.request).then((response) => {
            if (response) {
                console.debug("URL found in cache:", response.url)
            }
            return response || fetch(event.request);
        }));
});
