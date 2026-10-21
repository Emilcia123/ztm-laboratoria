self.addEventListener('install', () => self.skipWaiting());
self.addEventListener('activate', (event) => event.waitUntil(self.clients.claim()));

self.addEventListener('notificationclick', (event) => {
    event.notification.close();
    const url = event.notification.data?.url || './';
    event.waitUntil(self.clients.openWindow(url));
});

self.addEventListener('push', (event) => {
    let message = { title: 'Web Push', body: event.data ? event.data.text() : '' };
    try {
        message = event.data.json();
    } catch (err) {
        
    }
    event.waitUntil(
        self.registration.showNotification(message.title, {
            body: message.body,
            icon: message.icon || 'android.png',
            data: { url: './' },
        })
    );
});