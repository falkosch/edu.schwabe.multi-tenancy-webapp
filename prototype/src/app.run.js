import { StartStateId } from './start/start.route';

appRun.$inject = ['$state'];

export function appRun($state) {
    return $state.go(StartStateId);
}
