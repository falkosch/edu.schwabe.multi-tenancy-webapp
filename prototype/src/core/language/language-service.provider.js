import _ from 'lodash';

import { LanguageServiceName, LanguageService } from './language.service';

export const LanguageServiceProviderName = `${LanguageServiceName}Provider`;

export class LanguageServiceProvider {

    static $inject = [
        '$translatePartialLoaderProvider',
        '$injector',
    ];

    constructor($translatePartialLoaderProvider, $injector) {
        this.$translatePartialLoaderProvider = $translatePartialLoaderProvider;
        this.$injector = $injector;

        this._initialize();
    }

    _initialize() {
        const injectableNames = this.$injector.annotate(LanguageService);
        this.$get = _.concat(
            injectableNames,
            (...injectables) => new LanguageService(...injectables),
        );
    }

    addPart(name) {
        this.$translatePartialLoaderProvider.addPart(name);
        return this;
    }
}
