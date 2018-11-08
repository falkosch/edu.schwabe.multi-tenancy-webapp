import angular from 'angular';

import { NavComponent, NavName } from './nav.component';
import { NavServiceName, NavService } from './nav.service';

export const NavModule = angular
    .module('app.header.nav', [])
    .service(NavServiceName, NavService)
    .component(NavName, NavComponent)
    .name;
