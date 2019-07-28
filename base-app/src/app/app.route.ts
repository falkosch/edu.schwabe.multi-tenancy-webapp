import { StateProvider } from '@uirouter/angularjs';
import { AppComponentName } from './app.component';
import { LanguageServiceName, LanguageService } from '../core/language/language.service';

appRoute.$inject = ['$stateProvider'];

export const AppStateId = 'app';

export function appRoute(
    $stateProvider: StateProvider,
): void {
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
                languageReady: [
                    LanguageServiceName,
                    (languageService: LanguageService) => languageService.onReady(),
                ],
            },
        });
}
