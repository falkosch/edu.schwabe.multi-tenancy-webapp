import { NavServiceName } from '../header/nav/nav.service';
import { ProfileStateId } from './profile.route';

profileNavigationRun.$inject = [NavServiceName];

export function profileNavigationRun(navService) {
    navService.forState('Profile', ProfileStateId);
}
