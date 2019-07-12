import { LanguageServiceProviderName } from '../../core/language/language-service.provider';

headerI18NConfig.$inject = [LanguageServiceProviderName];

export function headerI18NConfig(languageServiceProvider) {
    languageServiceProvider.addPart(__dirname);
}
