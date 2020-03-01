import _ from 'lodash';
import angular from 'angular';

import { EventEmitterServiceName, EventEmitterService, EventEmitterCacheId } from './event-emitter.service';
import { EventEmitterModule } from './event-emitter.module';
import { EventEmitter } from './event-emitter.model';

describe(`${EventEmitterModule}.${EventEmitterServiceName}`, () => {

    const testEventName = 'test';
    const testEventValue = 'testValue';

    let testUnit: EventEmitterService;

    let eventEmitterMock: jasmine.SpyObj<EventEmitter<any>>;

    let $cacheFactory: jasmine.SpyObj<angular.ICacheFactoryService>;
    let $injector: jasmine.SpyObj<angular.auto.IInjectorService>;
    let $rootScope: angular.IRootScopeService;

    beforeEach(() => {

        eventEmitterMock = {
            emit: jasmine.createSpy().and.throwError('test failure'),
            subscribe: jasmine.createSpy().and.throwError('test failure'),
        } as any;

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

    describe('.injectableName(eventName)', () => {

        it('should generate an inject name containing the given event name', () => {
            expect(testUnit.injectableName(testEventName))
                .toContain(testEventName);
        });

    });

    describe('.of(eventName)', () => {

        let testEmitterName: string;
        let testEmitterCache: jasmine.SpyObj<angular.ICacheObject>;

        beforeEach(() => {
            testEmitterName = testUnit.injectableName(testEventName);

            spyOn($injector, 'has').and.callThrough();
            spyOn($injector, 'get').and.callThrough();

            testEmitterCache = $cacheFactory.get(EventEmitterCacheId) as any;
            spyOn(testEmitterCache, 'get').and.callThrough();
            spyOn(testEmitterCache, 'put').and.callThrough();
        });

        describe('when event emitter is cached', () => {

            beforeEach(() => {
                testEmitterCache.get.withArgs(testEmitterName)
                    .and.returnValue(eventEmitterMock);
            });

            it('should return the cached instance', () => {
                expect(testUnit.of(testEventName))
                    .toBe(eventEmitterMock);

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
                        .and.returnValue(true);

                    ($injector.get as any).withArgs(testEmitterName)
                        .and.returnValue(eventEmitterMock as any);
                });

                it('should return the injected event emitter', () => {
                    expect(testUnit.of(testEventName))
                        .toBe(eventEmitterMock);

                    expect(testEmitterCache.get)
                        .toHaveBeenCalledWith(testEmitterName);

                    expect($injector.has)
                        .toHaveBeenCalledWith(testEmitterName);

                    expect($injector.get as any)
                        .toHaveBeenCalledWith(testEmitterName);
                });

                it('should put the injected event emitter in the cache', () => {
                    testUnit.of(testEventName);

                    expect(testEmitterCache.put)
                        .toHaveBeenCalledWith(testEmitterName, eventEmitterMock);
                });

            });

            describe('when $injector does NOT have a provider for the event emitter', () => {

                beforeEach(() => {
                    $injector.has.withArgs(testEmitterName)
                        .and.returnValue(false);

                    ($injector.get as any).withArgs(testEmitterName)
                        .and.throwError('test failure');
                });

                it('should return a new event emitter', () => {
                    const actualEventEmitter = testUnit.of(testEventName);

                    expect(actualEventEmitter)
                        .not.toBe(eventEmitterMock);

                    expect(actualEventEmitter)
                        .toEqual(jasmine.any(EventEmitter));

                    expect(testEmitterCache.get)
                        .toHaveBeenCalledWith(testEmitterName);

                    expect($injector.has)
                        .toHaveBeenCalledWith(testEmitterName);

                    expect($injector.get as any)
                        .not.toHaveBeenCalledWith(testEmitterName);
                });

                it('should put the new event emitter in the cache', () => {
                    const actualEventEmitter = testUnit.of(testEventName);

                    expect(testEmitterCache.put)
                        .toHaveBeenCalledWith(testEmitterName, actualEventEmitter);
                });

            });

        });

        describe('returned event emitter', () => {

            const testEvent: angular.IAngularEvent = {} as any;

            let actualEventEmitter: EventEmitter<any>;

            beforeEach(() => {
                actualEventEmitter = testUnit.of(testEventName);
                spyOn($rootScope, '$broadcast').and.returnValue(testEvent);
            });

            it(`should broadcast ${testEventValue} for event ${testEventName}`, () => {
                actualEventEmitter.emit(testEventValue);

                expect($rootScope.$broadcast)
                    .toHaveBeenCalledWith(testEventName, testEventValue);
            });

            it('should return the event object of the broadcast', () => {
                expect(actualEventEmitter.emit(testEventValue))
                    .toBe(testEvent);
            });

        });

    });

});
