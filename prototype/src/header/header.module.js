import angular from 'angular';

import { NavModule } from './nav/nav.module';
import { UserStateModule } from '../core/user-state/user-state.module';

import { HeaderComponent, HeaderName } from './header.component';
import { GlobalSpinnerModule } from '../ui/global-spinner/global-spinner.module';

export const HeaderModule = angular
    .module('app.header', [
        NavModule,
        UserStateModule,
        GlobalSpinnerModule,
    ])
    .component(HeaderName, HeaderComponent)
    .name;
