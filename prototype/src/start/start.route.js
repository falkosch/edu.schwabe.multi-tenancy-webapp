import { StartName } from './start.component';

startRoute.$inject = ['$stateProvider'];

export const StartStateId = 'app.start';

export function startRoute($stateProvider) {
    $stateProvider
        .state({
            name: StartStateId,
            data: {
                title: 'Everything has a start',
            },
            url: '/',
            views: {
                main: StartName,
            },
        });
}
