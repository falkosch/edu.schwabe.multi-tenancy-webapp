import angular from 'angular';
import { LoginName } from './login.component';

loginRoute.$inject = ['$stateProvider'];

export const LoginStateId = 'app.login';

export function loginRoute($stateProvider) {
    $stateProvider
        .state({
            name: LoginStateId,
            resolve: {
                longAsync: [
                    '$timeout',
                    $timeout => $timeout(angular.noop, 1000),
                ],
            },
            url: '/login',
            views: {
                main: LoginName,
            },
        });
}
