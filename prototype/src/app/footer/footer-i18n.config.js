import { LanguageServiceProviderName } from '../../core/language/language-service.provider';

footerI18NConfig.$inject = [LanguageServiceProviderName];

export function footerI18NConfig(languageServiceProvider) {
    languageServiceProvider.addPart(__dirname);
}
