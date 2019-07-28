import _ from 'lodash';
import angular from 'angular';

import { HeaderModule } from './header.module';
import { LanguageModule } from '../../core/language/language.module';
import { LanguageServiceProviderName, LanguageServiceProvider } from '../../core/language/language-service.provider';
import { headerI18NConfig } from './header-i18n.config';

describe(`${HeaderModule} i18n config`, () => {

    let languageServiceProviderSpied: LanguageServiceProvider;

    let $injector: angular.auto.IInjectorService;

    beforeEach(() => {

        angular.mock.module(LanguageModule, (_$injector_: angular.auto.IInjectorService) => {
            languageServiceProviderSpied = _$injector_.get(LanguageServiceProviderName);
            spyOn(languageServiceProviderSpied, 'addPart');
        });

        angular.mock.module(HeaderModule);

        inject((_$injector_) => {
            $injector = _$injector_;
        });

    });

    describe('given architecture', () => {

        const expectedInjects = [
            LanguageServiceProviderName,
        ];

        it(`should only depend on ${expectedInjects.join(',')}`, () => {
            expect(_.sortBy($injector.annotate(headerI18NConfig)))
                .toEqual(_.sortBy(expectedInjects));
        });

    });

    it('should add a translate partial for the module', () => {
        expect(languageServiceProviderSpied.addPart)
            .toHaveBeenCalledWith(jasmine.any(String));
    });

});
