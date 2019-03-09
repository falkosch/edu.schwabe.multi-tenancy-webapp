import _ from 'lodash';
import moment from 'moment';

import { LanguageConstants } from './language.constants';

export const LanguageServiceName = 'languageService';

export const ERROR_LANGUAGE_NOT_AVAILABLE = 'language not available';

export class LanguageService {

    static $inject = [
        '$q',
        '$rootScope',
        '$translate',
    ];

    constructor(
        $q,
        $rootScope,
        $translate,
    ) {
        this.$q = $q;
        this.$rootScope = $rootScope;
        this.$translate = $translate;

        this._initialize();
    }

    _initialize() {
        this.$translate.use(LanguageConstants.default);

        this.on$translatePartialLoaderStructureChangedDisposal = this.$rootScope
            .$on(
                '$translatePartialLoaderStructureChanged',
                () => { this._onPartialAdded(); },
            );

        this.on$translateChangeSuccess = this.$rootScope
            .$on(
                '$translateChangeSuccess',
                (event, { language }) => { this._onLanguageChanged(language); },
            );
    }

    _onPartialAdded() {
        return this.$translate.refresh();
    }

    _onLanguageChanged(code) {
        return moment.locale(code);
    }

    get allAvailableLanguages() {
        return LanguageConstants.allAvailable;
    }

    changeLanguage(code) {
        if (!_.includes(this.allAvailableLanguages, code)) {
            return this.$q.reject(new Error(ERROR_LANGUAGE_NOT_AVAILABLE));
        }

        return this.$translate.use(code);
    }

    onReady() {
        return this.$translate.onReady();
    }
}
