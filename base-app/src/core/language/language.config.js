import { LanguageConstants } from './language.constants';

languageConfig.$inject = [
    '$translateProvider',
];

export function languageConfig(
    $translateProvider,
) {
    if (process.env.NODE_ENV !== 'test') {
        $translateProvider
            .useLoader('$translatePartialLoader', {
                urlTemplate: `${LanguageConstants.partialsUrlTemplate}?v=${__VERSION__}`,
            });
    }

    $translateProvider
        .determinePreferredLanguage()
        .fallbackLanguage(LanguageConstants.fallback)
        .useMissingTranslationHandlerLog()
        .useSanitizeValueStrategy('sanitize');
}
