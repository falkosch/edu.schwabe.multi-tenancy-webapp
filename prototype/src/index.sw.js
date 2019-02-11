/* eslint-disable no-restricted-globals */
/* eslint-disable compat/compat */

// Service worker "index"

import _ from 'lodash';

const { assets } = global.serviceWorkerOption;

const CACHE_NAME = `${__dirname}/${__filename}?v=${__VERSION__}`;

const assetsToCache = _.map(
    [...assets, './'],
    path => new URL(path, global.location).toString(),
);

// When the service worker is first added to a computer.
self.addEventListener('install', (event) => {
    // Add core website files to cache during serviceworker installation.
    event.waitUntil(
        global.caches
            .open(CACHE_NAME)
            .then(cache => cache.addAll(assetsToCache)),
    );
});

// After the install event.
self.addEventListener('activate', (event) => {
    // Clean the caches
    event.waitUntil(
        global.caches
            .keys()
            .then(cacheNames => Promise.all(
                _.map(cacheNames, (cacheName) => {
                    // Delete the caches that are not the current one.
                    if (_.startsWith(cacheName, CACHE_NAME)) {
                        return null;
                    }

                    return global.caches.delete(cacheName);
                }),
            )),
    );
});

self.addEventListener('message', (event) => {
    if (event.data.action === 'skipWaiting') {
        if (_.isFunction(self.skipWaiting)) {
            self.skipWaiting();
            self.clients.claim();
        }
    }
});

self.addEventListener('fetch', (event) => {
    const { request } = event;

    // Ignore not GET request.
    if (request.method !== 'GET') {
        return;
    }

    const requestUrl = new URL(request.url);

    // Ignore difference origin.
    if (requestUrl.origin !== location.origin) {
        return;
    }

    const resource = global.caches.match(request).then((response) => {
        if (response) {
            console.debug(`[SW] fetch URL ${requestUrl.href} from cache`);
            return response;
        }

        // Load and cache known assets.
        return fetch(request)
            .then((responseNetwork) => {
                if (!responseNetwork || !responseNetwork.ok) {
                    console.debug(
                        `[SW] URL [${requestUrl.toString()}] wrong responseNetwork:`,
                        responseNetwork.status,
                        responseNetwork.type,
                    );
                    return responseNetwork;
                }

                console.debug(`[SW] URL ${requestUrl.href} fetched`);

                const responseCache = responseNetwork.clone();

                global.caches
                    .open(CACHE_NAME)
                    .then(cache => cache.put(request, responseCache));

                return responseNetwork;
            })
            .catch(() => {
                // User is landing on our page.
                if (event.request.mode === 'navigate') {
                    return global.caches.match('./');
                }
                return null;
            });
    });

    event.respondWith(resource);
});
