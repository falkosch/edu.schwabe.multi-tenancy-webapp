import angular from 'angular';
import uiRouter from '@uirouter/angularjs';

import { PromiseTrackerModule } from '../../core/promise-tracker/promise-tracker.module';

import { GlobalSpinnerServiceName, GlobalSpinnerService } from './global-spinner.service';
import { globalSpinnerUiRouterTransitionsRun } from './global-spinner-ui-router-transitions.run';

export const GlobalSpinnerModule = angular
    .module('app.ui.global-spinner', [
        uiRouter,
        PromiseTrackerModule,
    ])
    .service(GlobalSpinnerServiceName, GlobalSpinnerService)
    .run(globalSpinnerUiRouterTransitionsRun)
    .name;
