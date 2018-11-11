import angular from 'angular';
import uiRouter from '@uirouter/angularjs';

import { NavModule } from '../header/nav/nav.module';

import { StartName, StartComponent } from './start.component';
import { startRoute } from './start.route';
import { startNavigationRun } from './start-navigation.run';
import { startRun } from './start.run';

export const StartModule = angular
    .module('app.start', [
        uiRouter,
        NavModule,
    ])
    .component(StartName, StartComponent)
    .config(startRoute)
    .run(startNavigationRun)
    .run(startRun)
    .name;
