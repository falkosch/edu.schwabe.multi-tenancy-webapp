import { NavigationServiceName, NavigationService } from '../core/navigation/navigation.service';

import { LoginStateId } from './login.route';

loginNavigationRun.$inject = [NavigationServiceName];

export function loginNavigationRun(navigationService: NavigationService): void {
    navigationService.forState('login.navigation-entry', LoginStateId);
}
