import { LanguageServiceProviderName } from '../core/language/language-service.provider';

loginI18NConfig.$inject = [LanguageServiceProviderName];

export function loginI18NConfig(languageServiceProvider) {
    languageServiceProvider.addPart(__dirname);
}
