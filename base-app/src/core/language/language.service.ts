import _ from 'lodash';
import moment from 'moment';

import { LanguageConstants } from './language.constants';
import { EventEmitterServiceName, EventEmitterService } from '../event-emitter/event-emitter.service';

export const LanguageServiceName = 'languageService';

export enum $translateEvents {
    PartialLoaderStructureChanged = '$translatePartialLoaderStructureChanged',
    ChangeSuccess = '$translateChangeSuccess',
}

export const ERROR_LANGUAGE_NOT_AVAILABLE = 'language not available';

export class LanguageService {

    public static $inject = [
        '$q',
        '$translate',
        EventEmitterServiceName,
    ];

    public constructor(
        private $q: angular.IQService,
        private $translate: angular.translate.ITranslateService,
        private eventEmitterService: EventEmitterService,
    ) {
        this.$translate.use(LanguageConstants.default);

        this.eventEmitterService
            .of<void>($translateEvents.PartialLoaderStructureChanged)
            .subscribe((): void => { this._onPartialAdded(); });

        this.eventEmitterService
            .of<{ language: string }>($translateEvents.ChangeSuccess)
            .subscribe(
                (__: angular.IAngularEvent, { language }: { language: string }): void => {
                    this._onLanguageChanged(language);
                },
            );
    }

    private _onPartialAdded(): angular.IPromise<void> {
        return this.$translate.refresh();
    }

    private _onLanguageChanged(code: string): string {
        return moment.locale(code);
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

        return this.$translate.use(code);
    }

    public onReady(): angular.IPromise<void> {
        return this.$translate.onReady();
    }
}
