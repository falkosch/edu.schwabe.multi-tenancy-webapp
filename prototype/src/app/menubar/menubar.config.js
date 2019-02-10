import { LanguageServiceProviderName } from '../../core/language/language-service.provider';

menubarConfig.$inject = [LanguageServiceProviderName];

export function menubarConfig(languageServiceProvider) {
    languageServiceProvider.addPart(__dirname);
}
