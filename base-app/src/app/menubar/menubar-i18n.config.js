import { LanguageServiceProviderName } from '../../core/language/language-service.provider';

menubarI18NConfig.$inject = [LanguageServiceProviderName];

export function menubarI18NConfig(languageServiceProvider) {
    languageServiceProvider.addPart(__dirname);
}
