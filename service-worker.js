const CACHE = 'arshavin-grade4-v5';
const CORE = [
  './',
  './index.html',
  './assets/css/site.css',
  './assets/js/learning-shell.js',
  './assets/js/sleep-lesson.js',
  './assets/js/ai-claims-lesson.js',
  './assets/js/pm25-lesson.js',
  './assets/js/levers-lesson.js',
  './subjects/human-body/sleep-ready-brain.html',
  './subjects/ai-science/fact-opinion-ai-claims.html',
  './subjects/environment/pm25-safer-action.html',
  './subjects/maker-engineering/levers-make-work-easier.html',
  './worksheets/student/sleep-ready-brain-a4.html',
  './worksheets/student/fact-opinion-ai-claims-a4.html',
  './worksheets/student/pm25-safer-action-a4.html',
  './worksheets/student/levers-make-work-easier-a4.html',
  './worksheets/teacher-guides/fact-opinion-ai-claims-guide.html',
  './worksheets/teacher-guides/pm25-safer-action-guide.html',
  './worksheets/teacher-guides/levers-make-work-easier-guide.html',
  './manifest.webmanifest'
];
self.addEventListener('install', event => {
  event.waitUntil(caches.open(CACHE).then(cache => cache.addAll(CORE)));
  self.skipWaiting();
});
self.addEventListener('activate', event => {
  event.waitUntil(caches.keys().then(keys => Promise.all(keys.filter(key => key !== CACHE).map(key => caches.delete(key)))));
  self.clients.claim();
});
self.addEventListener('fetch', event => {
  if (event.request.method !== 'GET') return;
  event.respondWith(caches.match(event.request).then(cached => cached || fetch(event.request).then(response => {
    const copy = response.clone();
    caches.open(CACHE).then(cache => cache.put(event.request, copy));
    return response;
  }).catch(() => caches.match('./index.html'))));
});