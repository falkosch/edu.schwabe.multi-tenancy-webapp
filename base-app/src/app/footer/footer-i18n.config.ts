import { LanguageServiceProviderName, LanguageServiceProvider } from '../../core/language/language-service.provider';

footerI18NConfig.$inject = [LanguageServiceProviderName];

export function footerI18NConfig(languageServiceProvider: LanguageServiceProvider): void {
    languageServiceProvider.addPart(__dirname);
}
