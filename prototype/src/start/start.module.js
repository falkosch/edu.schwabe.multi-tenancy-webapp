import angular from 'angular';
import uiRouter from '@uirouter/angularjs';

import { LanguageModule } from '../core/language/language.module';
import { NavigationModule } from '../core/navigation/navigation.module';

import { StartName, StartComponent } from './start.component';
import { startRoute } from './start.route';
import { startI18NConfig } from './start-i18n.config';
import { startNavigationRun } from './start-navigation.run';

import './i18n/en.json';

export const StartModule = angular
    .module('app.start', [
        uiRouter,
        LanguageModule,
        NavigationModule,
    ])
    .component(StartName, StartComponent)
    .config(startRoute)
    .config(startI18NConfig)
    .run(startNavigationRun)
    .name;
