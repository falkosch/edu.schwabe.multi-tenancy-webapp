import { StartStateId } from './start/start.route';

indexRun.$inject = ['$state'];

export function indexRun($state) {
    return $state.go(StartStateId);
}
