import { AppName } from './app.component';

appRoute.$inject = ['$locationProvider', '$stateProvider'];

export function appRoute(
    $locationProvider,
    $stateProvider,
) {
    $locationProvider.html5Mode(true);

    $stateProvider
        .state({
            name: 'app',
            url: '',
            abstract: true,
            component: AppName,
        });
}
