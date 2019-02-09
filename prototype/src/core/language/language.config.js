import { LanguageConstants } from './language.constants';

languageConfig.$inject = [
    '$translateProvider',
];

export function languageConfig(
    $translateProvider,
) {
    $translateProvider.useLoader('$translatePartialLoader', {
        urlTemplate: `${LanguageConstants.partialsUrlTemplate}?v=${__VERSION__}`,
    });
    $translateProvider.determinePreferredLanguage();
    $translateProvider.fallbackLanguage(LanguageConstants.fallbackLanguage);
    $translateProvider.useMissingTranslationHandlerLog();
    $translateProvider.useSanitizeValueStrategy('sanitize');
}
