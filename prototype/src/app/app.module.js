import angular from 'angular';
import uiRouter from '@uirouter/angularjs';

import { UiModule } from '../ui/ui.module';
import { HeaderModule } from './header/header.module';
import { FooterModule } from './footer/footer.module';
import { MenubarModule } from './menubar/menubar.module';

import { AppComponent, AppComponentName } from './app.component';
import { appRoute } from './app.route';
import { LanguageModule } from '../core/language/language.module';

export const AppModule = angular
    .module('app', [
        uiRouter,

        LanguageModule,
        UiModule,
        HeaderModule,
        FooterModule,
        MenubarModule,
    ])
    .component(AppComponentName, AppComponent)
    .config(appRoute)
    .name;
