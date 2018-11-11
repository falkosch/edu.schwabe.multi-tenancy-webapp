import angular from 'angular';
import uiRouter from '@uirouter/angularjs';

import { NavModule } from '../header/nav/nav.module';

import { LoginName, LoginComponent } from './login.component';
import { loginRoute } from './login.route';
import { loginNavigationRun } from './login-navigation.run';

export const LoginModule = angular
    .module('app.login', [
        uiRouter,
        NavModule,
    ])
    .component(LoginName, LoginComponent)
    .config(loginRoute)
    .run(loginNavigationRun)
    .name;
