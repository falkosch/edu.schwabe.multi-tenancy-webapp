import { LanguageConstants } from './language.constants';

languageConfig.$inject = [
    '$translateProvider',
];

export function languageConfig(
    $translateProvider: angular.translate.ITranslateProvider,
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
}
