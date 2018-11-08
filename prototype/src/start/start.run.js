import { StartStateId } from './start.route';

startRun.$inject = ['$state'];

export function startRun($state) {
    return $state.go(StartStateId);
}
