import { LanguageServiceProviderName } from './core/language/language-service.provider';

indexI18NConfig.$inject = [LanguageServiceProviderName];

export function indexI18NConfig(languageServiceProvider) {
    languageServiceProvider.addPart(__dirname);
}
