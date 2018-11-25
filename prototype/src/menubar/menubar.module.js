import angular from 'angular';
import uiRouter from '@uirouter/angularjs';

import { MenubarComponent, MenubarName } from './menubar.component';
import { UserStateModule } from '../core/user-state/user-state.module';
import { GlobalSpinnerModule } from '../ui/global-spinner/global-spinner.module';
import { BackendModule } from '../core/backend/backend.module';

export const MenubarModule = angular
    .module('app.menubar', [
        uiRouter,
        BackendModule,
        UserStateModule,
        GlobalSpinnerModule,
    ])
    .component(MenubarName, MenubarComponent)
    .name;
