import { NavigationServiceName } from '../core/navigation/navigation.service';

import { StartStateId } from './start.route';

startNavigationRun.$inject = [NavigationServiceName];

export function startNavigationRun(navigationService) {
    navigationService.forState('Start', StartStateId);
}
