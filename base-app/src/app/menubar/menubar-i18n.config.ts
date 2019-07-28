import { LanguageServiceProviderName, LanguageServiceProvider } from '../../core/language/language-service.provider';

menubarI18NConfig.$inject = [LanguageServiceProviderName];

export function menubarI18NConfig(languageServiceProvider: LanguageServiceProvider): void {
    languageServiceProvider.addPart(__dirname);
}
