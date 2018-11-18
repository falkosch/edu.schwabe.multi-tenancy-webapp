import { LoginName } from './login.component';

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
                title: 'Login',
            },
            resolve: {},
            url: '/login',
            views: {
                main: LoginName,
            },
        });
}
