import { NavServiceName } from '../header/nav/nav.service';
import { StartStateId } from './start.route';

startNavigationRun.$inject = [NavServiceName];

export function startNavigationRun(navService) {
    navService.forState('Start', StartStateId);
}
