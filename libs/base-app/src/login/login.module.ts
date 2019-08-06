import angular from 'angular';
import uiRouter from '@uirouter/angularjs';
import angularMaterial from 'angular-material';

import { NavModule } from '../app/header/nav/nav.module';
import { UserStateModule } from '../core/user-state/user-state.module';
import { GlobalSpinnerModule } from '../ui/global-spinner/global-spinner.module';
import { LanguageModule } from '../core/language/language.module';
import { RequiresLoginStateAccessGuardModule } from '../core/state-access-control/requires-login-state-access-guard/requires-login-state-access-guard.module';

import { LoginComponentName, LoginComponent } from './login.component';
import { loginRoute } from './login.route';
import { loginNavigationRun } from './login-navigation.run';
import { loginI18NConfig } from './login-i18n.config';

import './i18n/de.json';
import './i18n/en.json';

export const LoginModule = angular
    .module('app.login', [
        uiRouter,
        angularMaterial,
        LanguageModule,
        NavModule,
        UserStateModule,
        GlobalSpinnerModule,
        RequiresLoginStateAccessGuardModule,
    ])
    .component(LoginComponentName, LoginComponent)
    .config(loginI18NConfig)
    .config(loginRoute)
    .run(loginNavigationRun)
    .name;
