import { LoginComponentName } from './login.component';

loginRoute.$inject = ['$stateProvider'];

export const LoginStateId = 'app.login';

export function loginRoute($stateProvider) {
    $stateProvider
        .state({
            name: LoginStateId,
            accessControl: {
                public: true,
            },
            data: {
                title: 'login.navigation-entry',
            },
            resolve: {},
            url: '/login',
            views: {
                main: LoginComponentName,
            },
        });
}
