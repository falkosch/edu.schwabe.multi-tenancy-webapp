import { LanguageServiceProviderName, LanguageServiceProvider } from './core/language/language-service.provider';

indexI18NConfig.$inject = [LanguageServiceProviderName];

export function indexI18NConfig(languageServiceProvider: LanguageServiceProvider): void {
    languageServiceProvider.addPart(__dirname);
}
