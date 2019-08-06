import { LanguageServiceProviderName, LanguageServiceProvider } from '../core/language/language-service.provider';

profileI18NConfig.$inject = [LanguageServiceProviderName];

export function profileI18NConfig(languageServiceProvider: LanguageServiceProvider): void {
    languageServiceProvider.addPart(__dirname);
}
