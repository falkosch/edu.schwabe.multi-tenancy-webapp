import { LanguageServiceProviderName } from '../core/language/language-service.provider';

startI18NConfig.$inject = [LanguageServiceProviderName];

export function startI18NConfig(languageServiceProvider) {
    languageServiceProvider.addPart(__dirname);
}
