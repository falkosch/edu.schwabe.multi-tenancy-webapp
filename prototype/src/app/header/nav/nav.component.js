import { NavController } from './nav.controller';

import './nav.component.scss';
import templateUrl from './nav.template.html';

export const NavComponentName = 'appNav';

export const NavComponent = {
    controller: NavController,
    templateUrl,
    require: {
        sideNav: '^?mdSidenav',
    },
};
