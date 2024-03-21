function registerServiceWorker() {
    if (window !== undefined && ("serviceWorker" in navigator)) {
        window.addEventListener('load', () => {
            navigator.serviceWorker.register("/sw.js").then((registration) => {
                console.debug("Service Worker registered successfully");
            });
        });
    }
}

registerServiceWorker();
