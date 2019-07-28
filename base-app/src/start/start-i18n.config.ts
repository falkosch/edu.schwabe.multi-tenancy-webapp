import { LanguageServiceProviderName, LanguageServiceProvider } from '../core/language/language-service.provider';

startI18NConfig.$inject = [LanguageServiceProviderName];

export function startI18NConfig(languageServiceProvider: LanguageServiceProvider): void {
    languageServiceProvider.addPart(__dirname);
}
