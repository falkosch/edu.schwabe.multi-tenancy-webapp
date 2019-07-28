import { NavigationServiceName, NavigationService } from '../core/navigation/navigation.service';

import { ProfileStateId } from './profile.route';

profileNavigationRun.$inject = [NavigationServiceName];

export function profileNavigationRun(navigationService: NavigationService): void {
    navigationService.forState('profile.navigation-entry', ProfileStateId);
}
