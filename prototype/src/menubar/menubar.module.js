import angular from 'angular';
import uiRouter from '@uirouter/angularjs';

import { MenubarComponent, MenubarName } from './menubar.component';

export const MenubarModule = angular
    .module('app.menubar', [
        uiRouter,
    ])
    .component(MenubarName, MenubarComponent)
    .name;
