import { LanguageServiceProviderName, LanguageServiceProvider } from '../core/language/language-service.provider';

loginI18NConfig.$inject = [LanguageServiceProviderName];

export function loginI18NConfig(languageServiceProvider: LanguageServiceProvider): void {
    languageServiceProvider.addPart(__dirname);
}
