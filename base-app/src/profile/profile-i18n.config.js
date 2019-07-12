import { LanguageServiceProviderName } from '../core/language/language-service.provider';

profileI18NConfig.$inject = [LanguageServiceProviderName];

export function profileI18NConfig(languageServiceProvider) {
    languageServiceProvider.addPart(__dirname);
}
