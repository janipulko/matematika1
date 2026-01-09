const USE_SW = true; // Ta spremenljivka se ne uporablja neposredno tukaj, ampak v play.html za nadzor registracije.
const CACHE_NAME = 'math-game-v1.2.4';
const ASSETS = [
  './',
  'play.html',
  'unlock.html',
  'manifest.json',
  'icon.svg',
  'utils/soundManager.js',
  'utils/palettes.js',
  'components/MathGame.js',
  'components/TargetDisplay.js',
  'components/ScoreGrid.js',
  'components/StepIndicator.js',
  'components/ControlsBar.js',
  'components/SettingsModal.js',
  'components/ColorSettingsModal.js',
  'components/ResultModal.js',
  'components/UnlockPage.js',
  'components/ComboButton.js',
  'utils/soundManager.js',
  'data/groups.json'
];

self.addEventListener('install', (event) => {
  event.waitUntil(
    caches.open(CACHE_NAME).then((cache) => {
      return cache.addAll(ASSETS);
    }).then(() => self.skipWaiting())
  );
});

self.addEventListener('activate', (event) => {
  event.waitUntil(
    caches.keys().then((keys) => {
      return Promise.all(
        keys.filter((key) => key !== CACHE_NAME).map((key) => caches.delete(key))
      );
    }).then(() => self.clients.claim())
  );
});

self.addEventListener('fetch', (event) => {
  event.respondWith(
    caches.match(event.request).then((response) => {
      return response || fetch(event.request);
    })
  );
});

self.addEventListener('message', (event) => {
  if (event.data === 'SKIP_WAITING') {
    self.skipWaiting();
  }
});
