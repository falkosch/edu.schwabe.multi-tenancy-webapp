import _ from 'lodash';

import { LanguageServiceName, LanguageService } from './language.service';
import { EventEmitterService } from '../event-emitter/event-emitter.service';

export const LanguageServiceProviderName = `${LanguageServiceName}Provider`;

export class LanguageServiceProvider implements angular.IServiceProvider {

    public static $inject = [
        '$translatePartialLoaderProvider',
    ];

    public $get = _.concat(
        LanguageService.$inject as any[],
        (
            $q: angular.IQService,
            $translate: angular.translate.ITranslateService,
            tmhDynamicLocale: angular.dynamicLocale.tmhDynamicLocaleService,
            eventEmitterService: EventEmitterService,
        ) => new LanguageService($q, $translate, tmhDynamicLocale, eventEmitterService),
    );

    public constructor(
        private $translatePartialLoaderProvider: angular.translate.ITranslatePartialLoaderProvider,
    ) { }

    public addPart(name: string): LanguageServiceProvider {
        this.$translatePartialLoaderProvider.addPart(this._normalize(name));
        return this;
    }

    private _normalize(name: string): string {
        return _.replace(name, /(\.\.[/\\])/g, '_/');
    }
}
