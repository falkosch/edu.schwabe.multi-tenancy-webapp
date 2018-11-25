import angular from 'angular';
import uiRouter from '@uirouter/angularjs';

import { NavigationModule } from '../core/navigation/navigation.module';

import { StartName, StartComponent } from './start.component';
import { startRoute } from './start.route';
import { startNavigationRun } from './start-navigation.run';

export const StartModule = angular
    .module('app.start', [
        uiRouter,
        NavigationModule,
    ])
    .component(StartName, StartComponent)
    .config(startRoute)
    .run(startNavigationRun)
    .name;
