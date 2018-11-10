import { NavServiceName } from '../header/nav/nav.service';
import { LoginStateId } from './login.route';

loginNavigationRun.$inject = [NavServiceName];

export function loginNavigationRun(navService) {
    navService.forState('Login', LoginStateId);
}
