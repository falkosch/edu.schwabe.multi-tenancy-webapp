import { StateProvider } from '@uirouter/angularjs';

import { StartComponentName } from './start.component';

startRoute.$inject = ['$stateProvider'];

export const StartStateId = 'app.start';

export function startRoute($stateProvider: StateProvider): void {
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
