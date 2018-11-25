import { AppName } from './app.component';

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
            component: AppName,
            accessControl: {
                public: true,
            },
        });
}
