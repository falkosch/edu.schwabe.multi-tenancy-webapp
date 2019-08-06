import _ from 'lodash';
import angular from 'angular';

import { IndexModule } from './index.module';
import { LanguageModule } from './core/language/language.module';
import { LanguageServiceProviderName, LanguageServiceProvider } from './core/language/language-service.provider';
import { indexI18NConfig } from './index-i18n.config';

describe(`${IndexModule} i18n config`, () => {

    let languageServiceProviderSpied: LanguageServiceProvider;

    let $injector: angular.auto.IInjectorService;

    beforeEach(() => {

        angular.mock.module(LanguageModule, (_$injector_: angular.auto.IInjectorService) => {
            $injector = _$injector_;

            languageServiceProviderSpied = $injector.get(LanguageServiceProviderName);
            spyOn(languageServiceProviderSpied, 'addPart');
        });

        angular.mock.module(IndexModule);

        inject();

    });

    describe('given architecture', () => {

        const expectedInjects = [
            LanguageServiceProviderName,
        ];

        it(`should only depend on ${expectedInjects.join(',')}`, () => {
            expect(_.sortBy($injector.annotate(indexI18NConfig)))
                .toEqual(_.sortBy(expectedInjects));
        });

    });

    it('should add a translate partial for the module', () => {
        expect(languageServiceProviderSpied.addPart)
            .toHaveBeenCalledWith(jasmine.any(String));
    });

});
