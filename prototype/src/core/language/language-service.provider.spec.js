import _ from 'lodash';
import angular from 'angular';
import angularTranslate from 'angular-translate';

import { LanguageModule } from './language.module';
import { LanguageServiceProviderName, LanguageServiceProvider } from './language-service.provider';
import { LanguageService } from './language.service';

describe(`${LanguageModule}.${LanguageServiceProviderName}`, () => {

    let testUnit;

    let $translatePartialLoaderProviderMock;

    let $injector;

    beforeEach(() => {

        angular.mock.module(angularTranslate, ($translatePartialLoaderProvider) => {
            $translatePartialLoaderProviderMock = $translatePartialLoaderProvider;
            spyOn($translatePartialLoaderProviderMock, 'addPart');
        });

        angular.mock.module(LanguageModule, (_$injector_) => {
            testUnit = _$injector_.get(LanguageServiceProviderName);
        });

        inject((_$injector_) => {
            $injector = _$injector_;
        });

    });

    describe('given architecture', () => {

        const expectedInjects = [
            '$translatePartialLoaderProvider',
        ];

        it(`should only depend on ${expectedInjects.join(',')}`, () => {
            expect(_.sortBy($injector.annotate(LanguageServiceProvider)))
                .toEqual(_.sortBy(expectedInjects));
        });

        it(`should be an instanceof ${LanguageServiceProvider.name}`, () => {
            expect(testUnit)
                .toEqual(jasmine.any(LanguageServiceProvider));
        });

    });

    describe('.$get', () => {

        it(`should be able to create an instance of ${LanguageService.name}`, () => {
            expect($injector.invoke(testUnit.$get))
                .toEqual(jasmine.any(LanguageService));
        });

    });

    describe('.addPart()', () => {

        const testPartName = 'TEST';

        it('should return this instance', () => {
            expect(testUnit.addPart(testPartName))
                .toBe(testUnit);
        });

        it('should register the translate partial', () => {
            testUnit.addPart(testPartName);

            expect($translatePartialLoaderProviderMock.addPart)
                .toHaveBeenCalledWith(testPartName);
        });

    });

});
