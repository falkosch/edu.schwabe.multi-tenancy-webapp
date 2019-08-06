import { NavigationServiceName, NavigationService } from '../core/navigation/navigation.service';

import { LoginStateId } from './login.route';
import { RequiresLoginStateAccessGuardServiceName, RequiresLoginStateAccessGuardService } from '../core/state-access-control/requires-login-state-access-guard/requires-login-state-access-guard.service';

loginNavigationRun.$inject = [
    NavigationServiceName,
    RequiresLoginStateAccessGuardServiceName,
];

export function loginNavigationRun(
    navigationService: NavigationService,
    requireLoginStateAccessGuardService: RequiresLoginStateAccessGuardService,
): void {
    navigationService.forState('login.navigation-entry', LoginStateId);

    requireLoginStateAccessGuardService.setLoginStateName(LoginStateId);
}
