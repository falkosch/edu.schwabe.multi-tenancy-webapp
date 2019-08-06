import _ from 'lodash';
import angular from 'angular';
import angularTranslate from 'angular-translate';

import { LanguageModule } from './language.module';
import { LanguageConstants } from './language.constants';
import { languageConfig } from './language.config';

describe(`${LanguageModule} config`, () => {

    let $translateProviderMock: angular.translate.ITranslateProvider;
    let tmhDynamicLocaleProviderMock: angular.dynamicLocale.tmhDynamicLocaleProvider;

    let $injector: angular.auto.IInjectorService;

    beforeEach(() => {

        angular.mock.module(angularTranslate, (
            $translateProvider: angular.translate.ITranslateProvider,
            _$injector_: angular.auto.IInjectorService,
        ) => {
            $injector = _$injector_;

            $translateProviderMock = $translateProvider;
            spyOn($translateProviderMock, 'useLoader');
            spyOn($translateProviderMock, 'determinePreferredLanguage')
                .and.returnValue($translateProviderMock);
            spyOn($translateProviderMock, 'fallbackLanguage')
                .and.returnValue($translateProviderMock);
            spyOn($translateProviderMock, 'useSanitizeValueStrategy')
                .and.returnValue($translateProviderMock);
            spyOn($translateProviderMock, 'use')
                .withArgs().and.returnValue(LanguageConstants.default as any);
        });

        angular.mock.module('tmh.dynamicLocale', (
            tmhDynamicLocaleProvider: angular.dynamicLocale.tmhDynamicLocaleProvider,
        ) => {
            tmhDynamicLocaleProviderMock = tmhDynamicLocaleProvider;
            spyOn(tmhDynamicLocaleProviderMock, 'localeLocationPattern');
            spyOn(tmhDynamicLocaleProviderMock, 'defaultLocale');
        });

        angular.mock.module(LanguageModule);

        inject();

    });

    describe('given architecture', () => {

        const expectedInjects = [
            '$translateProvider',
            'tmhDynamicLocaleProvider',
        ];

        it(`should only depend on ${expectedInjects.join(',')}`, () => {
            expect(_.sortBy($injector.annotate(languageConfig)))
                .toEqual(_.sortBy(expectedInjects));
        });

    });

    it('should NOT use a translate loader in test environment', () => {
        expect($translateProviderMock.useLoader)
            .toHaveBeenCalledTimes(0);
    });

    it('should let $translate determine a preferred language', () => {
        expect($translateProviderMock.determinePreferredLanguage)
            .toHaveBeenCalledTimes(1);
    });

    it('should set a fallback language', () => {
        expect($translateProviderMock.fallbackLanguage)
            .toHaveBeenCalledWith(LanguageConstants.fallback);
    });

    it('should specify a safe sanitize value strategy for expressions in the translations', () => {
        expect($translateProviderMock.useSanitizeValueStrategy)
            .toHaveBeenCalledWith('sanitize');
    });

    it('should setup the dynamic locale provider', () => {
        expect(tmhDynamicLocaleProviderMock.localeLocationPattern)
            .toHaveBeenCalledWith(LanguageConstants.dynamicLocalesUrlTemplate);

        expect(tmhDynamicLocaleProviderMock.defaultLocale)
            .toHaveBeenCalledWith(LanguageConstants.default);
    });

});
