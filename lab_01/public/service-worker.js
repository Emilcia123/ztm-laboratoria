importScripts('https://storage.googleapis.com/workbox-cdn/releases/7.4.1/workbox-sw.js');
const { precaching, routing, strategies } = workbox;

// 1. Pliki "szkieletu" aplikacji zapisujemy w cache od razu przy instalacji service workera.
//    Zmiana numeru "revision" wymusza ponowne pobranie danego pliku.

precaching.precacheAndRoute([
  { url: './', revision: '4' },
  { url: 'index.html', revision: '4' },
  { url: 'index.js', revision: '4' },
  { url: 'manifest.json', revision: '4' },
  { url: 'offline.html', revision: '4' },
]);

// 2. Strony HTML: najpierw sieć, a gdy jej nie ma - wersja z cache
routing.registerRoute(
  ({ request }) => request.mode === 'navigate',
  new strategies.NetworkFirst({ cacheName: 'strony' })
);

// 3. Obrazy: najpierw cache, sieć tylko gdy obrazka nie ma
routing.registerRoute(
  ({ request }) => request.destination === 'image',
  new strategies.CacheFirst({ cacheName: 'obrazy' })
);

// 4. Obsługa sytuacji braku sieci i braku strony w cache (wyświetlenie offline.html)
routing.setCatchHandler(async ({ request }) => {
  if (request.mode === 'navigate') {
    return precaching.matchPrecache('offline.html');
  }
  return Response.error();
});