import { LanguageServiceProviderName, LanguageServiceProvider } from '../../core/language/language-service.provider';

headerI18NConfig.$inject = [LanguageServiceProviderName];

export function headerI18NConfig(languageServiceProvider: LanguageServiceProvider): void {
    languageServiceProvider.addPart(__dirname);
}
