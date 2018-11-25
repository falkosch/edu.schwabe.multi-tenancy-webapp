import angular from 'angular';
import uiRouter from '@uirouter/angularjs';

import { UserStateModule } from '../../core/user-state/user-state.module';
import { GlobalSpinnerModule } from '../../ui/global-spinner/global-spinner.module';
import { BackendModule } from '../../core/backend/backend.module';

import { MenubarComponent, MenubarName } from './menubar.component';

export const MenubarModule = angular
    .module('app.menubar', [
        uiRouter,
        BackendModule,
        UserStateModule,
        GlobalSpinnerModule,
    ])
    .component(MenubarName, MenubarComponent)
    .name;
