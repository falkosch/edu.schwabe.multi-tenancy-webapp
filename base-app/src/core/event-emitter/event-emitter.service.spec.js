import _ from 'lodash';
import angular from 'angular';

import { EventEmitterServiceName, EventEmitterService, EventEmitterCacheId } from './event-emitter.service';
import { EventEmitterModule } from './event-emitter.module';
import { EventEmitter } from './event-emitter.model';

describe(`${EventEmitterModule}.${EventEmitterServiceName}`, () => {

    const testEventName = 'testEvent';
    const testEventValue = 'testValue';
    const testEventEmitter = new EventEmitter({}, _.noop);

    let testUnit;

    let $cacheFactory;
    let $injector;
    let $rootScope;

    beforeEach(() => {

        angular.mock.module(EventEmitterModule);

        inject((_$cacheFactory_, _$injector_, _$rootScope_) => {
            $cacheFactory = _$cacheFactory_;
            $injector = _$injector_;
            $rootScope = _$rootScope_;

            testUnit = $injector.get(EventEmitterServiceName);
        });

    });

    describe('given architecture', () => {

        const expectedInjects = [
            '$injector',
            '$rootScope',
            '$cacheFactory',
        ];

        it(`should only depend on ${expectedInjects.join(',')}`, () => {
            expect(_.sortBy($injector.annotate(EventEmitterService)))
                .toEqual(_.sortBy(expectedInjects));
        });

        it(`should be an instanceof ${EventEmitterService.name}`, () => {
            expect(testUnit)
                .toEqual(jasmine.any(EventEmitterService));
        });

    });

    describe('.constructor(...)', () => {

        it('should create a cache for the event emitters', () => {
            expect(testUnit._cachedEmitters)
                .toEqual(jasmine.any(Object));
        });

    });

    describe('.injectableName(eventName)', () => {

        it('should generate an inject name containing the given event name', () => {
            expect(testUnit.injectableName(testEventName))
                .toContain(testEventName);
        });

    });

    describe('.of(eventName)', () => {

        let testEmitterName;
        let testEmitterCache;

        beforeEach(() => {
            testEmitterName = testUnit.injectableName(testEventName);

            spyOn($injector, 'has').and.callThrough();
            spyOn($injector, 'get').and.callThrough();

            testEmitterCache = $cacheFactory.get(EventEmitterCacheId);
            spyOn(testEmitterCache, 'get').and.callThrough();
            spyOn(testEmitterCache, 'put').and.callThrough();
        });

        describe('when event emitter is cached', () => {

            beforeEach(() => {
                testEmitterCache.get.withArgs(testEmitterName)
                    .and
                    .returnValue(testEventEmitter);
            });

            it('should return the cached instance', () => {
                expect(testUnit.of(testEventName))
                    .toBe(testEventEmitter);

                expect(testEmitterCache.get)
                    .toHaveBeenCalledWith(testEmitterName);

                expect(testEmitterCache.put)
                    .toHaveBeenCalledTimes(0);

                expect($injector.has)
                    .toHaveBeenCalledTimes(0);

                expect($injector.get)
                    .toHaveBeenCalledTimes(0);
            });

        });

        describe('when event emitter is NOT cached', () => {

            describe('when $injector has a provider for the event emitter', () => {

                beforeEach(() => {
                    $injector.has.withArgs(testEmitterName)
                        .and
                        .returnValue(true);

                    $injector.get.withArgs(testEmitterName)
                        .and
                        .returnValue(testEventEmitter);
                });

                it('should return the injected event emitter', () => {
                    expect(testUnit.of(testEventName))
                        .toBe(testEventEmitter);

                    expect(testEmitterCache.get)
                        .toHaveBeenCalledWith(testEmitterName);

                    expect($injector.has)
                        .toHaveBeenCalledWith(testEmitterName);

                    expect($injector.get)
                        .toHaveBeenCalledWith(testEmitterName);
                });

                it('should put the injected event emitter in the cache', () => {
                    testUnit.of(testEventName);

                    expect(testEmitterCache.put)
                        .toHaveBeenCalledWith(testEmitterName, testEventEmitter);
                });

            });

            describe('when $injector has NOT a provider for the event emitter', () => {

                beforeEach(() => {
                    $injector.has.withArgs(testEmitterName)
                        .and
                        .returnValue(false);

                    $injector.get.withArgs(testEmitterName)
                        .and
                        .callFake(() => { throw new Error('failure'); });
                });

                it('should return a new event emitter', () => {
                    const actualEventEmitter = testUnit.of(testEventName);

                    expect(actualEventEmitter)
                        .not
                        .toBe(testEventEmitter);

                    expect(actualEventEmitter)
                        .toEqual(jasmine.any(EventEmitter));

                    expect(testEmitterCache.get)
                        .toHaveBeenCalledWith(testEmitterName);

                    expect($injector.has)
                        .toHaveBeenCalledWith(testEmitterName);

                    expect($injector.get)
                        .not
                        .toHaveBeenCalledWith(testEmitterName);
                });

                it('should put the new event emitter in the cache', () => {
                    const actualEventEmitter = testUnit.of(testEventName);

                    expect(testEmitterCache.put)
                        .toHaveBeenCalledWith(testEmitterName, actualEventEmitter);
                });

            });

        });

        describe('returned event emitter', () => {

            let actualEventEmitter;

            beforeEach(() => {
                actualEventEmitter = testUnit.of(testEventName);
            });

            it('should have an observable with a subscribe function', () => {
                expect(actualEventEmitter.observeable)
                    .toEqual(
                        jasmine.objectContaining({
                            subscribe: jasmine.any(Function),
                        }),
                    );
            });

            it('should have an emitter function', () => {
                expect(actualEventEmitter.emitter)
                    .toEqual(jasmine.any(Function));
            });


            describe('emitter function', () => {

                const testEvent = {};

                beforeEach(() => {
                    spyOn($rootScope, '$broadcast');
                });

                it(`should broadcast ${testEventValue} for event ${testEventName}`, () => {
                    actualEventEmitter.emit(testEventValue);

                    expect($rootScope.$broadcast)
                        .toHaveBeenCalledWith(testEventName, testEventValue);
                });

                it('should return the event object of the broadcast', () => {
                    $rootScope.$broadcast
                        .and
                        .returnValue(testEvent);

                    expect(actualEventEmitter.emit(testEventValue))
                        .toBe(testEvent);
                });

            });

        });

    });

});
