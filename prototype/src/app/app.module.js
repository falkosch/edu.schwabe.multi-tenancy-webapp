import angular from 'angular';
import uiRouter from '@uirouter/angularjs';

import { UiModule } from '../ui/ui.module';
import { HeaderModule } from './header/header.module';
import { FooterModule } from './footer/footer.module';
import { MenubarModule } from './menubar/menubar.module';

import { AppComponent, AppName } from './app.component';
import { appRoute } from './app.route';

export const AppModule = angular
    .module('app', [
        uiRouter,

        UiModule,
        HeaderModule,
        FooterModule,
        MenubarModule,
    ])
    .component(AppName, AppComponent)
    .config(appRoute)
    .name;
