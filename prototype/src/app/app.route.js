import { AppComponentName } from './app.component';
import { LanguageServiceName } from '../core/language/language.service';

appRoute.$inject = ['$stateProvider'];

export const AppStateId = 'app';

export function appRoute(
    $stateProvider,
) {
    $stateProvider
        .state({
            name: AppStateId,
            url: '',
            abstract: true,
            component: AppComponentName,
            accessControl: {
                public: true,
            },
            resolve: {
                languageReady: [LanguageServiceName, languageService => languageService.onReady()],
            },
        });
}
