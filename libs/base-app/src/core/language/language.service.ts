import _ from 'lodash';
import moment from 'moment';

import { LanguageConstants } from './language.constants';
import { EventEmitterServiceName, EventEmitterService } from '../event-emitter/event-emitter.service';

export const LanguageServiceName = 'languageService';

export enum $translateEvents {
    PartialLoaderStructureChanged = '$translatePartialLoaderStructureChanged',
}

export const ERROR_LANGUAGE_NOT_AVAILABLE = 'language not available';

export class LanguageService {

    public static $inject = [
        '$q',
        '$translate',
        'tmhDynamicLocale',
        EventEmitterServiceName,
    ];

    public constructor(
        private $q: angular.IQService,
        private $translate: angular.translate.ITranslateService,
        private tmhDynamicLocale: angular.dynamicLocale.tmhDynamicLocaleService,
        private eventEmitterService: EventEmitterService,
    ) {
        this.eventEmitterService
            .of<void>($translateEvents.PartialLoaderStructureChanged)
            .subscribe((): void => { this._onPartialAdded(); });
    }

    private _onPartialAdded(): angular.IPromise<void> {
        return this.$translate.refresh();
    }

    public get allAvailableLanguages(): string[] {
        return LanguageConstants.allAvailable;
    }

    public get currentLanguage(): string {
        return this.$translate.use();
    }

    public changeLanguage(code: string): angular.IPromise<string> {
        if (!_.includes(this.allAvailableLanguages, code)) {
            return this.$q.reject(new Error(ERROR_LANGUAGE_NOT_AVAILABLE));
        }

        const { currentLanguage } = this;
        if (currentLanguage === code) {
            return this.$q.resolve(currentLanguage);
        }

        return this.changeLocale(code)
            .then(() => this.$translate.use(code))
            .catch(
                (e: any) => this.changeLanguage(currentLanguage)
                    .then(() => this.$q.reject(e)),
            );
    }

    private changeLocale(code: string): angular.IPromise<string> {
        moment.locale(code);
        return this.tmhDynamicLocale.set(code);
    }

    public onReady(): angular.IPromise<void> {
        return this.changeLanguage(LanguageConstants.default)
            .then(() => this.$translate.onReady());
    }
}
