import angular from 'angular';
import angularAnimate from 'angular-animate';
import angularAria from 'angular-aria';
import angularMessages from 'angular-messages';
import angularMaterial from 'angular-material';
import uiRouter from '@uirouter/angularjs';

import { HeaderModule } from './header/header.module';
import { FooterModule } from './footer/footer.module';
import { StartModule } from './start/start.module';

import { AppComponent, AppName } from './app.component';
import { appRoute } from './app.route';

export const AppModule = angular
    .module('app', [
        angularAnimate,
        angularAria,
        angularMessages,
        angularMaterial,
        uiRouter,
        HeaderModule,
        FooterModule,
        StartModule,
    ])
    .component(AppName, AppComponent)
    .config(appRoute)
    .name;
