import _ from 'lodash';
import angular from 'angular';
import moment from 'moment';

import { LanguageModule } from './language.module';
import {
    LanguageServiceName, LanguageService, ERROR_LANGUAGE_NOT_AVAILABLE, $translateEvents,
} from './language.service';
import { LanguageConstants } from './language.constants';
import { EventEmitterServiceName, EventEmitterService } from '../event-emitter/event-emitter.service';
import { EventEmitter, EventConsumer } from '../event-emitter/event-emitter.model';

describe(`${LanguageModule}.${LanguageServiceName}`, () => {

    const testNotAvailableLanguageCode = 'NOT_AVAILABLE';
    const testLanguageCode = _.last(LanguageConstants.allAvailable) || '';

    let testUnit: LanguageService;

    let eventEmitterConsumers: Record<$translateEvents, EventConsumer<any>>;
    let eventEmitterMocks: Record<$translateEvents, jasmine.SpyObj<EventEmitter<any>>>;
    let eventEmitterServiceMock: jasmine.SpyObj<EventEmitterService>;

    let $translateMock: jasmine.SpyObj<angular.translate.ITranslateService>;

    let $injector: angular.auto.IInjectorService;
    let $rootScope: angular.IRootScopeService;
    let $q: angular.IQService;

    beforeEach(() => {

        eventEmitterConsumers = {
            [$translateEvents.PartialLoaderStructureChanged]: jasmine.createSpy().and.throwError('test failure'),
            [$translateEvents.ChangeSuccess]: jasmine.createSpy().and.throwError('test failure'),
        };

        eventEmitterMocks = {
            [$translateEvents.PartialLoaderStructureChanged]: {
                subscribe: jasmine.createSpy()
                    .and.callFake((consumer: EventConsumer<void>) => {
                        eventEmitterConsumers[
                            $translateEvents.PartialLoaderStructureChanged
                        ] = consumer;
                        return eventEmitterMocks[$translateEvents.PartialLoaderStructureChanged];
                    }),
            } as any,
            [$translateEvents.ChangeSuccess]: {
                subscribe: jasmine.createSpy()
                    .and.callFake((consumer: EventConsumer<{ language: string }>) => {
                        eventEmitterConsumers[$translateEvents.ChangeSuccess] = consumer;
                        return eventEmitterMocks[$translateEvents.ChangeSuccess];
                    }),
            } as any,
        };

        eventEmitterServiceMock = {
            of: jasmine.createSpy()
                .withArgs($translateEvents.PartialLoaderStructureChanged)
                .and.returnValue(eventEmitterMocks[$translateEvents.PartialLoaderStructureChanged])
                .withArgs($translateEvents.ChangeSuccess)
                .and.returnValue(eventEmitterMocks[$translateEvents.ChangeSuccess]),
        } as any;

        angular.mock.module(LanguageModule, {
            [EventEmitterServiceName]: eventEmitterServiceMock,
        });

        inject((_$injector_, _$rootScope_, _$q_, _$translate_) => {
            $injector = _$injector_;
            $rootScope = _$rootScope_;
            $q = _$q_;

            $translateMock = _$translate_;
            spyOn($translateMock, 'onReady');
            spyOn($translateMock, 'use');
            spyOn($translateMock, 'refresh');

            testUnit = $injector.get(LanguageServiceName);
        });

    });

    describe('given architecture', () => {

        const expectedInjects = [
            '$q',
            '$translate',
            EventEmitterServiceName,
        ];

        it(`should only depend on ${expectedInjects.join(',')}`, () => {
            expect(_.sortBy($injector.annotate(LanguageService)))
                .toEqual(_.sortBy(expectedInjects));
        });

        it(`should be an instanceof ${LanguageService.name}`, () => {
            expect(testUnit)
                .toEqual(jasmine.any(LanguageService));
        });

    });

    describe('.constructor(...)', () => {

        it('should initially use a default language', () => {
            expect($translateMock.use)
                .toHaveBeenCalledWith(LanguageConstants.default);
        });

        it('should subscribe to event $translateEvents.PartialLoaderStructureChanged', () => {
            expect(eventEmitterServiceMock.of)
                .toHaveBeenCalledWith($translateEvents.PartialLoaderStructureChanged);

            expect(eventEmitterMocks[$translateEvents.PartialLoaderStructureChanged].subscribe)
                .toHaveBeenCalledWith(jasmine.any(Function));
        });

        it('should subscribe to event $translateEvents.ChangeSuccess', () => {
            expect(eventEmitterServiceMock.of)
                .toHaveBeenCalledWith($translateEvents.ChangeSuccess);

            expect(eventEmitterMocks[$translateEvents.ChangeSuccess].subscribe)
                .toHaveBeenCalledWith(jasmine.any(Function));
        });

    });

    describe('structure changed event subscriber', () => {

        it('should refresh translation tables to load the partial\'s translations', () => {
            eventEmitterConsumers[$translateEvents.PartialLoaderStructureChanged](
                {} as angular.IAngularEvent,
                undefined,
            );

            expect($translateMock.refresh)
                .toHaveBeenCalledTimes(1);
        });

    });

    describe('change success event subscriber', () => {

        beforeEach(() => {
            spyOn(moment, 'locale');
        });

        it('should change global locale of moment', () => {
            eventEmitterConsumers[$translateEvents.ChangeSuccess](
                {} as angular.IAngularEvent,
                { language: testLanguageCode },
            );

            expect(moment.locale)
                .toHaveBeenCalledWith(testLanguageCode);
        });

    });

    describe('.allAvailableLanguages', () => {

        it('should return an array of strings with language codes', () => {
            expect(testUnit.allAvailableLanguages)
                .toEqual(jasmine.any(Array));

            _.forEach(testUnit.allAvailableLanguages, (code) => {
                expect(code)
                    .toEqual(jasmine.any(String));

                expect(_.trim(code))
                    .not.toEqual('');

                expect(moment().locale(code).locale())
                    .toEqual(code);
            });
        });

    });

    describe('.currentLanguages', () => {

        beforeEach(() => {
            ($translateMock.use as jasmine.Spy)
                .and.returnValue(testLanguageCode);
        });

        it('should return the language code of the currently set language', () => {
            expect(testUnit.currentLanguage)
                .toBe(testLanguageCode);
        });

    });

    describe('.changeLanguage(code)', () => {

        describe('when language code is in the available languages', () => {

            beforeEach(() => {
                ($translateMock.use as jasmine.Spy)
                    .and.returnValue($q.resolve(testLanguageCode));

                $translateMock.use.calls.reset();
            });

            it('should return a promise of when language is changed', (done) => {
                testUnit.changeLanguage(testLanguageCode)
                    .then(() => {
                        expect($translateMock.use)
                            .toHaveBeenCalledWith(testLanguageCode);

                        done();
                    })
                    .catch((error) => {
                        done.fail(error);
                    });

                $rootScope.$digest();
            });

        });

        describe('when language code is NOT in the available languages', () => {

            beforeEach(() => {
                $translateMock.use.calls.reset();
            });

            it(`should return a rejected promise with error ${ERROR_LANGUAGE_NOT_AVAILABLE}`, (done) => {
                expect(_.includes(testUnit.allAvailableLanguages, testNotAvailableLanguageCode))
                    .toBe(false);

                testUnit.changeLanguage(testNotAvailableLanguageCode)
                    .then(() => {
                        done.fail();
                    })
                    .catch((error) => {

                        expect($translateMock.use)
                            .toHaveBeenCalledTimes(0);

                        expect(error)
                            .toEqual(jasmine.any(Error));

                        expect(error.message)
                            .toEqual(ERROR_LANGUAGE_NOT_AVAILABLE);

                        done();
                    });

                $rootScope.$digest();
            });

        });

    });

    describe('.onReady()', () => {

        beforeEach(() => {
            $translateMock.onReady
                .and.returnValue($q.resolve());
        });

        it('should return a promise of when language files are readily loaded', (done) => {
            testUnit.onReady()
                .then(() => {
                    expect($translateMock.onReady)
                        .toHaveBeenCalledTimes(1);

                    done();
                })
                .catch((error) => {
                    done.fail(error);
                });

            $rootScope.$digest();
        });

    });

});
