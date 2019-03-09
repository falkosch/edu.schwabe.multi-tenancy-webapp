import _ from 'lodash';

import { LanguageServiceName, LanguageService } from './language.service';

export const LanguageServiceProviderName = `${LanguageServiceName}Provider`;

export class LanguageServiceProvider {

    static $inject = [
        '$translatePartialLoaderProvider',
    ];

    $get = _.concat(
        LanguageService.$inject,
        (...injectables) => new LanguageService(...injectables),
    );

    constructor($translatePartialLoaderProvider, $injector) {
        this.$translatePartialLoaderProvider = $translatePartialLoaderProvider;
    }

    addPart(name) {
        this.$translatePartialLoaderProvider.addPart(name);
        return this;
    }
}
