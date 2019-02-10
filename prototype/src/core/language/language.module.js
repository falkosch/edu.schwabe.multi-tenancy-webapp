import angular from 'angular';
import angularSanitize from 'angular-sanitize';
import angularTranslate from 'angular-translate';

import 'angular-translate-handler-log';
import 'angular-translate-loader-partial';
import 'angular-translate-interpolation-messageformat';

import { languageConfig } from './language.config';
import { LanguageServiceName } from './language.service';
import { LanguageServiceProvider } from './language-service.provider';

export const LanguageModule = angular
    .module('app.core.language', [
        angularSanitize,
        angularTranslate,
    ])
    .provider(LanguageServiceName, LanguageServiceProvider)
    .config(languageConfig)
    .name;
