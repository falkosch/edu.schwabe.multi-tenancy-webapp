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

    constructor($translatePartialLoaderProvider) {
        this.$translatePartialLoaderProvider = $translatePartialLoaderProvider;
    }

    addPart(name) {
        this.$translatePartialLoaderProvider.addPart(this._normalize(name));
        return this;
    }

    _normalize(name) {
        return _.replace(name, /(\.\.[/\\])/g, '_/');
    }
}
