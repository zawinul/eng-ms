var cacheName = 'weatherPWA-step-6-1';
var filesToCache = [
	'/',
	'/index.html',
	'/scripts/app.js',
	'/styles/inline.css',
	'/images/clear.png',
	'/images/cloudy-scattered-showers.png',
	'/images/cloudy.png',
	'/images/fog.png',
	'/images/ic_add_white_24px.svg',
	'/images/ic_refresh_white_24px.svg',
	'/images/partly-cloudy.png',
	'/images/rain.png',
	'/images/scattered-showers.png',
	'/images/sleet.png',
	'/images/snow.png',
	'/images/thunderstorm.png',
	'/images/wind.png'
];

function onInstall(e) {
	function onCacheLoaded(cache) {
		console.log('[ServiceWorker] Caching app shell');
		return cache.addAll(filesToCache);
	}

	console.log('[ServiceWorker] Install  (V2)');
	var c = caches.open(cacheName);
	var ct = c.then(onCacheLoaded);

	e.waitUntil(ct);
}

function onActivate(e) {
	console.log('[ServiceWorker] Activate');
	e.waitUntil(
		caches.keys().then(function (keyList) {
			return Promise.all(keyList.map(function (key) {
				if (key !== cacheName) {
					console.log('[ServiceWorker] Removing old cache', key);
					return caches.delete(key);
				}
			}));
		})
	);
	return self.clients.claim();
}

function onFetch(e) {
	console.log('[ServiceWorker] Fetch', e.request.url);
	e.respondWith(
		caches.match(e.request).then(function (response) {
			console.log('[F] C:'+!!response+' '+e.request.url);
			return response || fetch(e.request);
		})
	);
}

self.addEventListener('install', onInstall);
self.addEventListener('activate', onActivate);
self.addEventListener('fetch', onFetch);
