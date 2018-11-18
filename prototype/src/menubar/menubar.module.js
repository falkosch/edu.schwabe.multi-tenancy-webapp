import angular from 'angular';
import uiRouter from '@uirouter/angularjs';

import { MenubarComponent, MenubarName } from './menubar.component';
import { UserStateModule } from '../core/user-state/user-state.module';
import { GlobalSpinnerModule } from '../ui/global-spinner/global-spinner.module';

export const MenubarModule = angular
    .module('app.menubar', [
        uiRouter,
        UserStateModule,
        GlobalSpinnerModule,
    ])
    .component(MenubarName, MenubarComponent)
    .name;
