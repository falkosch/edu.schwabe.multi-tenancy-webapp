import _ from 'lodash';

import { ASSETS, SPIES } from './index.sw.mock';

import './index.sw';

describe('base service worker', () => {

    const ServiceWorkerEventNames = {
        install: 'install',
        activate: 'activate',
        fetch: 'fetch',
    };

    const testRequestUrl = `${self.location.origin}/test`;
    const testResponseBody = 'TEST';

    const testCurrentCacheKey = `${_.replace(__filename, /\.spec\.ts$/, '.ts')}?v=${VERSION}`;

    // DO NOT use outside of before- or it-blocks
    function eventMockFactory(request?: any): Event {
        // eslint-disable-next-line jasmine/no-unsafe-spy
        const eventMock = jasmine.createSpyObj('Event', ['waitUntil', 'respondWith']);
        eventMock.request = request;
        return eventMock;
    }

    // DO NOT use outside of before- or it-blocks
    function cacheMockFactory(): Cache {
        // eslint-disable-next-line jasmine/no-unsafe-spy
        return jasmine.createSpyObj('Cache', ['addAll', 'put']);
    }

    function requestMockFactory(
        navigateMode = false,
        getMethod = true,
        url = testRequestUrl,
        destination: RequestDestination = 'script',
    ): Request {
        // For the sake of simplicity of the tests we ignore that this object is not a full
        // Request object.
        // @ts-ignore
        return {
            url,
            mode: navigateMode ? 'navigate' : 'same-origin',
            method: getMethod ? 'GET' : 'POST',
            destination,
        };
    }

    function responseMockFactory(ok = true, body = testResponseBody): Response {
        return {
            ok,
            // body must actually be a ReadableStream instead of a string, but for the sake of
            // simplicity of the tests we ignore that here
            // @ts-ignore
            body,
            clone() {
                return { ...this };
            },
        };
    }

    function getEventListener(eventName: string): Function {
        const addEventCall = SPIES.addEventListener.lastCall(eventName);
        if (addEventCall) {
            return addEventCall[1];
        }
        throw new Error('test failure: event listener not registered');
    }

    function invokeListenerAndExtractPromise(
        eventListener: Function,
        eventMock: Event,
        spiedMethod: string,
    ): Promise<any> {
        let cachePromise: Promise<any>;
        (_.get(eventMock, spiedMethod) as jasmine.Spy)
            .and.callFake((promise) => { cachePromise = promise; });

        eventListener(eventMock);

        // In our tests, cachePromise will always be assigned unless the test developer made
        // mistakes anyway.
        // @ts-ignore
        return cachePromise;
    }

    beforeEach(() => {
        SPIES.fetch.resetCalls();
        SPIES.caches.delete.resetCalls();
        SPIES.caches.keys.resetCalls();
        SPIES.caches.match.resetCalls();
        SPIES.caches.open.resetCalls();
    });

    afterEach(() => {
        SPIES.fetch.resetSpy();
        SPIES.caches.delete.resetSpy();
        SPIES.caches.keys.resetSpy();
        SPIES.caches.match.resetSpy();
        SPIES.caches.open.resetSpy();
    });

    it(`should listen on SW-events ${_.join(_.values(ServiceWorkerEventNames), ', ')} once`, () => {
        _.forEach(ServiceWorkerEventNames, (eventName) => {
            expect(SPIES.addEventListener.lastCall(eventName))
                .toContain(eventName, jasmine.any(Function));
        });
    });

    describe(`when SW-event ${ServiceWorkerEventNames.install} is fired`, () => {

        let eventMock: Event;
        let cacheMock: Cache;
        let eventListener: Function;

        beforeEach(() => {
            eventMock = eventMockFactory();
            cacheMock = cacheMockFactory();
            SPIES.caches.open.strategy = () => Promise.resolve(cacheMock);
            eventListener = getEventListener(ServiceWorkerEventNames.install);
        });

        beforeEach(() => {
            SPIES.caches.open.resetCalls();
        });

        afterEach(() => {
            SPIES.caches.open.resetSpy();
        });

        it('should cache all assets in a named cache',
            () => invokeListenerAndExtractPromise(eventListener, eventMock, 'waitUntil')
                .then(() => {

                    expect(SPIES.caches.open.lastCall())
                        .toContain(testCurrentCacheKey);

                    expect(cacheMock.addAll)
                        .toHaveBeenCalledWith(
                            jasmine.arrayContaining(
                                _.map(ASSETS, (asset) => jasmine.stringMatching(asset)),
                            ),
                        );
                }));

    });

    describe(`when SW-event ${ServiceWorkerEventNames.activate} is fired`, () => {

        const testOldCachesKeys = [
            'WRONG_PREFIX_NO_VERSION',
            'WRONG_PREFIX_OLD_VERSION?v=0.0.0',
            `WRONG_PREFIX_CURRENT_VERSION?v=${VERSION}`,
        ];
        const testCachesKeys = [...testOldCachesKeys, testCurrentCacheKey];

        let eventMock: Event;
        let eventListener: Function;

        beforeEach(() => {
            eventMock = eventMockFactory();
            SPIES.caches.keys.strategy = () => Promise.resolve(testCachesKeys);
            SPIES.caches.delete.strategy = () => Promise.resolve(true);
            eventListener = getEventListener(ServiceWorkerEventNames.activate);
        });

        beforeEach(() => {
            SPIES.caches.delete.resetCalls();
            SPIES.caches.keys.resetCalls();
        });

        afterEach(() => {
            SPIES.caches.delete.resetSpy();
            SPIES.caches.keys.resetSpy();
        });

        it('should only clean the known old caches and NOT anything else',
            () => invokeListenerAndExtractPromise(eventListener, eventMock, 'waitUntil')
                .then(() => {

                    expect(SPIES.caches.delete.lastCalls())
                        .toEqual(_.zip(testOldCachesKeys));
                }));

    });

    describe(`when SW-event ${ServiceWorkerEventNames.fetch} is fired`, () => {

        let eventMock: Event;
        let fetchEventListener: Function;

        beforeEach(() => {
            fetchEventListener = getEventListener(ServiceWorkerEventNames.fetch);
        });

        beforeEach(() => {
            SPIES.fetch.resetCalls();
            SPIES.caches.match.resetCalls();
            SPIES.caches.open.resetCalls();
        });

        afterEach(() => {
            SPIES.fetch.resetSpy();
            SPIES.caches.match.resetSpy();
            SPIES.caches.open.resetSpy();
        });


        describe('when request is "navigate" to SPA state', () => {

            const testRequestWithCachedResponse = requestMockFactory(true, true, testRequestUrl, 'document');
            const testCachedResponse = responseMockFactory();

            beforeEach(() => {
                eventMock = eventMockFactory(testRequestWithCachedResponse);
                SPIES.caches.match.strategy = () => Promise.resolve(testCachedResponse);
                SPIES.caches.open.strategy = () => Promise.reject(new Error('test failure'));
                SPIES.fetch.strategy = () => Promise.reject(new Error('test failure'));
            });

            it('should query and respond with the cached SPA index.html',
                () => invokeListenerAndExtractPromise(fetchEventListener, eventMock, 'respondWith')
                    .then(() => {
                        expect(
                            SPIES.caches.match.toHaveBeenCalledWith('./'),
                        ).toBe(true);

                        expect(
                            SPIES.caches.match.toHaveBeenCalledWith(testRequestWithCachedResponse),
                        ).toBe(false);
                    }));

        });

        describe('when a cached response exists for the request in the event', () => {

            const testRequestWithCachedResponse = requestMockFactory();
            const testCachedResponse = responseMockFactory();

            beforeEach(() => {
                eventMock = eventMockFactory(testRequestWithCachedResponse);
                SPIES.caches.match.strategy = () => Promise.resolve(testCachedResponse);
                SPIES.caches.open.strategy = () => Promise.reject(new Error('test failure'));
            });

            it('should have queried the cache for a cached response using the given request',
                () => invokeListenerAndExtractPromise(fetchEventListener, eventMock, 'respondWith')
                    .then(() => {

                        expect(
                            SPIES.caches.match.toHaveBeenCalledWith(testRequestWithCachedResponse),
                        ).toBe(true);
                    }));

            it('should return the cached response',
                () => invokeListenerAndExtractPromise(fetchEventListener, eventMock, 'respondWith')
                    .then((actualResponse) => {

                        expect(actualResponse)
                            .toBe(testCachedResponse);
                    }));

        });

        describe('when a cached response does NOT exist for the request in the event', () => {

            beforeEach(() => {
                SPIES.caches.match.strategy = () => Promise.resolve(undefined);
            });

            describe('when the request is valid', () => {

                const testRequest = requestMockFactory();
                const testResponse = responseMockFactory();

                let cacheMock: Cache;

                beforeEach(() => {
                    eventMock = eventMockFactory(testRequest);
                    SPIES.fetch.strategy = () => Promise.resolve(testResponse);
                    cacheMock = cacheMockFactory();
                    SPIES.caches.open.strategy = () => Promise.resolve(cacheMock);
                });

                it('should have passed the request to fetch',
                    () => invokeListenerAndExtractPromise(fetchEventListener, eventMock, 'respondWith')
                        .then(() => {

                            expect(SPIES.fetch.toHaveBeenCalledWith(testRequest))
                                .toBe(true);
                        }));

                it('should return the original response',
                    () => invokeListenerAndExtractPromise(fetchEventListener, eventMock, 'respondWith')
                        .then((actualResponse) => {

                            expect(actualResponse)
                                .toBe(testResponse);
                        }));

                describe('when the request is fine and the response is "ok"', () => {

                    it('should cache a clone of the response',
                        () => invokeListenerAndExtractPromise(fetchEventListener, eventMock, 'respondWith')
                            .then(() => {

                                expect(SPIES.caches.open.lastCall())
                                    .toContain(testCurrentCacheKey);

                                expect(cacheMock.put)
                                    .toHaveBeenCalledWith(
                                        testRequest,
                                        jasmine.objectContaining(testResponse),
                                    );
                            }));

                });

                describe('when the request is cross origin', () => {

                    beforeEach(() => {
                        eventMock = eventMockFactory(requestMockFactory(false, true, 'http://localhost:12345/test'));
                    });

                    it('should NOT cache the response',
                        () => invokeListenerAndExtractPromise(fetchEventListener, eventMock, 'respondWith')
                            .then(() => {

                                expect(SPIES.caches.open.lastCalls())
                                    .toEqual([]);
                            }));

                });

                describe('when the request is NOT a "GET"', () => {

                    beforeEach(() => {
                        eventMock = eventMockFactory(requestMockFactory(false, false));
                    });

                    it('should NOT cache the response',
                        () => invokeListenerAndExtractPromise(fetchEventListener, eventMock, 'respondWith')
                            .then(() => {

                                expect(SPIES.caches.open.lastCalls())
                                    .toEqual([]);
                            }));

                });

                describe('when the response is undefined', () => {

                    beforeEach(() => {
                        SPIES.fetch.strategy = () => Promise.resolve(undefined);
                    });

                    it('should NOT cache the response',
                        () => invokeListenerAndExtractPromise(fetchEventListener, eventMock, 'respondWith')
                            .then(() => {

                                expect(SPIES.caches.open.lastCalls())
                                    .toEqual([]);
                            }));

                });

                describe('when the response is NOT "ok"', () => {

                    const testResponseNotOk = responseMockFactory(false);

                    beforeEach(() => {
                        SPIES.fetch.strategy = () => Promise.resolve(testResponseNotOk);
                    });

                    it('should NOT cache the response',
                        () => invokeListenerAndExtractPromise(fetchEventListener, eventMock, 'respondWith')
                            .then(() => {

                                expect(SPIES.caches.open.lastCalls())
                                    .toEqual([]);
                            }));

                });

            });

            describe('when the request is NOT valid', () => {

                const testReason = new Error('test');

                beforeEach(() => {
                    SPIES.fetch.strategy = () => Promise.reject(testReason);
                });

                describe('when the request is caused by the user navigating to the webapp', () => {

                    const testNavigateRequest = requestMockFactory(true);

                    beforeEach(() => {
                        eventMock = eventMockFactory(testNavigateRequest);
                    });

                    it('should have queried the cache for a cached response using the given request',
                        () => invokeListenerAndExtractPromise(fetchEventListener, eventMock, 'respondWith')
                            .then(() => {

                                expect(SPIES.caches.match.toHaveBeenCalledWith(testNavigateRequest))
                                    .toBe(true);
                            }));

                    it('should resolve with whatever is cached for resource "./" instead',
                        () => invokeListenerAndExtractPromise(fetchEventListener, eventMock, 'respondWith')
                            .then(() => {

                                expect(SPIES.caches.match.toHaveBeenCalledWith('./'))
                                    .toBe(true);
                            }));

                });

                describe('when the request is NOT a navigate request', () => {

                    const testNonNavigateRequest = requestMockFactory(false);

                    beforeEach(() => {
                        eventMock = eventMockFactory(testNonNavigateRequest);
                    });

                    it('should have queried the cache for a cached response using the given request',
                        () => invokeListenerAndExtractPromise(fetchEventListener, eventMock, 'respondWith')
                            .catch(() => {

                                expect(
                                    SPIES.caches.match.toHaveBeenCalledWith(testNonNavigateRequest),
                                ).toBe(true);
                            }));

                    it('should reject and passthrough the reason for failing the fetch',
                        () => invokeListenerAndExtractPromise(fetchEventListener, eventMock, 'respondWith')
                            .catch((actualReason) => {

                                expect(actualReason)
                                    .toBe(testReason);
                            }));

                });

            });

        });

    });

});
