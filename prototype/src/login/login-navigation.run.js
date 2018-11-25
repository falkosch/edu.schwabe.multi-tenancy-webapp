import { NavigationServiceName } from '../core/navigation/navigation.service';

import { LoginStateId } from './login.route';

loginNavigationRun.$inject = [NavigationServiceName];

export function loginNavigationRun(navigationService) {
    navigationService.forState('Login', LoginStateId);
}
