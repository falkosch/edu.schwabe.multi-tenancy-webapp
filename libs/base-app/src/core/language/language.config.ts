import { LanguageConstants } from './language.constants';

languageConfig.$inject = [
    '$translateProvider',
    'tmhDynamicLocaleProvider',
];

export function languageConfig(
    $translateProvider: angular.translate.ITranslateProvider,
    tmhDynamicLocaleProvider: any,
): void {
    if (process.env.NODE_ENV !== 'test') {
        $translateProvider
            .useLoader('$translatePartialLoader', {
                urlTemplate: `${LanguageConstants.partialsUrlTemplate}?v=${VERSION}`,
            });
    }

    $translateProvider
        .determinePreferredLanguage()
        .fallbackLanguage(LanguageConstants.fallback)
        .useMissingTranslationHandlerLog()
        .useSanitizeValueStrategy('sanitize');

    tmhDynamicLocaleProvider.localeLocationPattern(LanguageConstants.dynamicLocalesUrlTemplate);
    tmhDynamicLocaleProvider.defaultLocale($translateProvider.use());
}
