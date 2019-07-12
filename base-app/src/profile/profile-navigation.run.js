import { NavigationServiceName } from '../core/navigation/navigation.service';

import { ProfileStateId } from './profile.route';

profileNavigationRun.$inject = [NavigationServiceName];

export function profileNavigationRun(navigationService) {
    navigationService.forState('profile.navigation-entry', ProfileStateId);
}
