const CACHE_NAME = 'math-game-v1.0.3';
const ASSETS = [
  './',
  'play.html',
  'unlock.html',
  'manifest.json',
  'icon.svg',
  'components/MathGame.js',
  'components/TargetDisplay.js',
  'components/ScoreGrid.js',
  'components/StepIndicator.js',
  'components/ControlsBar.js',
  'components/SettingsModal.js',
  'components/ResultModal.js',
  'components/UnlockPage.js',
  'components/ComboButton.js',
  'utils/soundManager.js'
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
