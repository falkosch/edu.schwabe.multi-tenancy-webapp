import angular from 'angular';

import { NavModule } from './nav/nav.module';
import { UserStateModule } from '../../core/user-state/user-state.module';
import { GlobalSpinnerModule } from '../../ui/global-spinner/global-spinner.module';

import { HeaderComponent, HeaderComponentName } from './header.component';

export const HeaderModule = angular
    .module('app.header', [
        NavModule,
        UserStateModule,
        GlobalSpinnerModule,
    ])
    .component(HeaderComponentName, HeaderComponent)
    .name;
