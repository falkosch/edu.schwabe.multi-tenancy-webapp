import angular from 'angular';
import uiRouter from '@uirouter/angularjs';
import angularMaterial from 'angular-material';

import { NavModule } from '../header/nav/nav.module';
import { UserStateModule } from '../core/user-state/user-state.module';
import { GlobalSpinnerModule } from '../ui/global-spinner/global-spinner.module';

import { LoginName, LoginComponent } from './login.component';
import { loginRoute } from './login.route';
import { loginNavigationRun } from './login-navigation.run';

export const LoginModule = angular
    .module('app.login', [
        uiRouter,
        angularMaterial,
        NavModule,
        UserStateModule,
        GlobalSpinnerModule,
    ])
    .component(LoginName, LoginComponent)
    .config(loginRoute)
    .run(loginNavigationRun)
    .name;
