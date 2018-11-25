import angular from 'angular';

import { NavComponent, NavName } from './nav.component';
import { NavigationModule } from '../../../core/navigation/navigation.module';

export const NavModule = angular
    .module('app.header.nav', [
        NavigationModule,
    ])
    .component(NavName, NavComponent)
    .name;
