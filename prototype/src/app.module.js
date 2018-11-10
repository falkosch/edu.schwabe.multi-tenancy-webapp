import angular from 'angular';
import angularAnimate from 'angular-animate';
import angularAria from 'angular-aria';
import angularMessages from 'angular-messages';
import angularMaterial from 'angular-material';
import uiRouter from '@uirouter/angularjs';

import { CoreModule } from './core/core.module';
import { UiModule } from './ui/ui.module';
import { HeaderModule } from './header/header.module';
import { FooterModule } from './footer/footer.module';
import { StartModule } from './start/start.module';
import { LoginModule } from './login/login.module';

import { AppComponent, AppName } from './app.component';
import { appRoute } from './app.route';
import { appUiRouterTransitionsRun } from './app-ui-router-transitions.run';

export const AppModule = angular
    .module('app', [
        angularAnimate,
        angularAria,
        angularMessages,
        angularMaterial,
        uiRouter,
        CoreModule,
        UiModule,
        HeaderModule,
        FooterModule,
        StartModule,
        LoginModule,
    ])
    .component(AppName, AppComponent)
    .config(appRoute)
    .run(appUiRouterTransitionsRun)
    .name;
