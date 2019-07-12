import { StartComponentName } from './start.component';

startRoute.$inject = ['$stateProvider'];

export const StartStateId = 'app.start';

export function startRoute($stateProvider) {
    $stateProvider
        .state({
            name: StartStateId,
            data: {
                title: 'start.title',
            },
            url: '/',
            views: {
                main: StartComponentName,
            },
        });
}
