import _ from 'lodash';
import angular from 'angular';

import { StartModule } from './start.module';
import { LanguageModule } from '../core/language/language.module';
import { LanguageServiceProviderName } from '../core/language/language-service.provider';
import { startI18NConfig } from './start-i18n.config';

describe(`${StartModule} i18n config`, () => {

    let languageServiceProviderSpied;

    let $injector;

    beforeEach(() => {

        angular.mock.module(LanguageModule, (_$injector_) => {
            languageServiceProviderSpied = _$injector_.get(LanguageServiceProviderName);
            spyOn(languageServiceProviderSpied, 'addPart');
        });

        angular.mock.module(StartModule);

        inject((_$injector_) => {
            $injector = _$injector_;
        });

    });

    describe('given architecture', () => {

        const expectedInjects = [
            LanguageServiceProviderName,
        ];

        it(`should only depend on ${expectedInjects.join(',')}`, () => {
            expect(_.sortBy($injector.annotate(startI18NConfig)))
                .toEqual(_.sortBy(expectedInjects));
        });

    });

    it('should add a translate partial for the module', () => {
        expect(languageServiceProviderSpied.addPart)
            .toHaveBeenCalledWith(jasmine.any(String));
    });

});
