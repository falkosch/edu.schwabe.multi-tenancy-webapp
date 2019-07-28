import _ from 'lodash';
import angular from 'angular';

import { MenubarModule } from './menubar.module';
import { LanguageModule } from '../../core/language/language.module';
import { LanguageServiceProviderName, LanguageServiceProvider } from '../../core/language/language-service.provider';
import { menubarI18NConfig } from './menubar-i18n.config';

describe(`${MenubarModule} i18n config`, () => {

    let languageServiceProviderSpied: LanguageServiceProvider;

    let $injector: angular.auto.IInjectorService;

    beforeEach(() => {

        angular.mock.module(LanguageModule, (_$injector_: angular.auto.IInjectorService) => {
            languageServiceProviderSpied = _$injector_.get(LanguageServiceProviderName);
            spyOn(languageServiceProviderSpied, 'addPart');
        });

        angular.mock.module(MenubarModule);

        inject((_$injector_) => {
            $injector = _$injector_;
        });

    });

    describe('given architecture', () => {

        const expectedInjects = [
            LanguageServiceProviderName,
        ];

        it(`should only depend on ${expectedInjects.join(',')}`, () => {
            expect(_.sortBy($injector.annotate(menubarI18NConfig)))
                .toEqual(_.sortBy(expectedInjects));
        });

    });

    it('should add a translate partial for the module', () => {
        expect(languageServiceProviderSpied.addPart)
            .toHaveBeenCalledWith(jasmine.any(String));
    });

});
