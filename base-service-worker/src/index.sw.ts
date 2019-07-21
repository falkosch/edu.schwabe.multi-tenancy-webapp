// Credit for the original code goes to https://www.npmjs.com/package/serviceworker-webpack-plugin
// https://github.com/oliviertassinari/serviceworker-webpack-plugin/blob/master/docs/src/sw.js

// The following code is adapted to the app needs

// Service worker "index"

import _ from 'lodash';

const { assets } = global.serviceWorkerOption;

const CACHE_PREFIX = __filename;
const CACHE_NAME = `${CACHE_PREFIX}?v=${VERSION}`;

const BLACK_LIST_TESTER = [
    // Ignore failed requests
    (__: Request, response: Response) => !response || !response.ok,
    // Ignore non-GET requests
    (request: Request) => request.method !== 'GET',
    // Ignore foreign origins
    (request: Request) => new URL(request.url).origin !== global.location.origin,
];

const ASSETS_TO_CACHE = _.map(
    [...assets, './'],
    path => new URL(path, global.location).toString(),
);

// When the service worker is first time installed,
self.addEventListener('install', (event) => {
    // cache all bundled static assets.
    event.waitUntil(
        global.caches
            .open(CACHE_NAME)
            .then((cache: Cache) => cache.addAll(ASSETS_TO_CACHE)),
    );
});

// After the install event.
self.addEventListener('activate', (event) => {
    // Clean the caches
    event.waitUntil(
        global.caches.keys()
            .then(cacheNames => Promise.all(
                _.map(cacheNames, (cacheName) => {
                    // Delete the caches that are not the current one.
                    if (_.startsWith(cacheName, CACHE_PREFIX)) {
                        return undefined;
                    }
                    return global.caches.delete(cacheName);
                }),
            )),
    );
});

self.addEventListener('fetch', (event) => {
    const { request } = event;

    event.respondWith(
        global.caches.match(request)
            .then((response) => {
                if (response) {
                    // Take from cache
                    return response;
                }

                // Load and cache known assets.
                return fetch(request)
                    .then((responseFromNetwork) => {
                        const isBlacklisted = _.some(
                            BLACK_LIST_TESTER,
                            tester => tester(request, responseFromNetwork),
                        );
                        if (isBlacklisted) {
                            return responseFromNetwork;
                        }

                        return global.caches.open(CACHE_NAME)
                            .then((cache) => {
                                const cachedResponse = responseFromNetwork.clone();
                                cache.put(request, cachedResponse);
                                return responseFromNetwork;
                            });
                    })
                    .catch((reason) => {
                        // User is landing on our page.
                        if (request.mode === 'navigate') {
                            return global.caches.match('./');
                        }
                        return Promise.reject(reason);
                    });
            }),
    );
});
