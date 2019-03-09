import _ from 'lodash';
import angular from 'angular';
import moment from 'moment';

import { LanguageModule } from './language.module';
import { LanguageServiceName, LanguageService, ERROR_LANGUAGE_NOT_AVAILABLE } from './language.service';
import { LanguageConstants } from './language.constants';

describe(`${LanguageModule}.${LanguageServiceName}`, () => {

    const testNotAvailableLanguageCode = 'NOT_AVAILABLE';

    let testUnit;

    let $translateMock;

    let $injector;
    let $rootScope;
    let $q;

    beforeEach(() => {

        angular.mock.module(LanguageModule);

        inject((_$injector_, _$rootScope_, _$q_, _$translate_) => {
            $injector = _$injector_;
            $rootScope = _$rootScope_;
            $q = _$q_;

            $translateMock = _$translate_;
            spyOn($translateMock, 'onReady');
            spyOn($translateMock, 'use');

            testUnit = $injector.get(LanguageServiceName);
        });

    });

    describe('given architecture', () => {

        const expectedInjects = [
            '$q',
            '$rootScope',
            '$translate',
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

    describe('.changeLanguage(code)', () => {

        describe('when language code is in the available languages', () => {

            let testLanguageCode;

            beforeEach(() => {
                testLanguageCode = _.last(testUnit.allAvailableLanguages);

                $translateMock.use
                    .and
                    .returnValue($q.resolve());

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
                .and
                .returnValue($q.resolve());
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
