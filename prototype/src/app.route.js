import { AppName } from './app.component';

appRoute.$inject = ['$stateProvider'];

export function appRoute(
    $stateProvider,
) {
    $stateProvider
        .state({
            name: 'app',
            url: '',
            abstract: true,
            component: AppName,
        });
}
