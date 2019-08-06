import { NavigationServiceName, NavigationService } from '../core/navigation/navigation.service';

import { StartStateId } from './start.route';

startNavigationRun.$inject = [NavigationServiceName];

export function startNavigationRun(navigationService: NavigationService): void {
    navigationService.forState('start.navigation-entry', StartStateId);
}
