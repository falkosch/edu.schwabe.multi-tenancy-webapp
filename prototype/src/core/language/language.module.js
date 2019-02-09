import angular from 'angular';
import angularTranslate from 'angular-translate';

import 'angular-translate-handler-log';
import 'angular-translate-loader-partial';
import 'angular-translate-interpolation-messageformat';

import { languageConfig } from './language.config';
import { LanguageServiceName, LanguageService } from './language.service';

export const LanguageModule = angular
    .module('app.core.language', [
        angularTranslate,
    ])
    .config(languageConfig)
    .service(LanguageServiceName, LanguageService)
    .name;
