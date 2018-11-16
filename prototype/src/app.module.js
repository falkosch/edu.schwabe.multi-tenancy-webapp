import 'moment';
import 'moment/min/locales';

import angular from 'angular';
import 'rx-angular';
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
import { appHtml5Config } from './app-html5.config';
import { appRoute } from './app.route';

export const AppModule = angular
    .module('app', [
        angularAnimate,
        angularAria,
        angularMessages,
        angularMaterial,
        uiRouter,
        'rx',

        CoreModule,
        UiModule,
        HeaderModule,
        FooterModule,
        StartModule,
        LoginModule,
    ])
    .component(AppName, AppComponent)
    .config(appHtml5Config)
    .config(appRoute)
    .name;
