import { StartName } from './start.component';

startRoute.$inject = ['$stateProvider'];

export const StartStateId = 'app.start';

export function startRoute($stateProvider) {
    $stateProvider
        .state({
            name: StartStateId,
            url: '/',
            views: {
                main: StartName,
            },
        });
}
