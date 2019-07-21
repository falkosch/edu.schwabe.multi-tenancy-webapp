import _ from 'lodash';
import moment from 'moment';

import { LanguageConstants } from './language.constants';
import { EventEmitterServiceName } from '../event-emitter/event-emitter.service';

export const LanguageServiceName = 'languageService';

export const ERROR_LANGUAGE_NOT_AVAILABLE = 'language not available';

export class LanguageService {

    static $inject = [
        '$q',
        '$translate',
        EventEmitterServiceName,
    ];

    constructor(
        $q,
        $translate,
        eventEmitterService,
    ) {
        this.$q = $q;
        this.$translate = $translate;
        this.eventEmitterService = eventEmitterService;

        this._initialize();
    }

    _initialize() {
        this.$translate.use(LanguageConstants.default);

        this._onStructureChangedDisposal = this.eventEmitterService
            .of('$translatePartialLoaderStructureChanged')
            .subscribe(() => { this._onPartialAdded(); });

        this._onChangeSuccessDisposal = this.eventEmitterService
            .of('$translateChangeSuccess')
            .subscribe((__, { language }) => { this._onLanguageChanged(language); });
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

    get currentLanguage() {
        return this.$translate.use();
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