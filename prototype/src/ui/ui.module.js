import angular from 'angular';

import { BusySpinnerModule } from './busy-spinner/busy-spinner.module';
import { GlobalSpinnerModule } from './global-spinner/global-spinner.module';

export const UiModule = angular
    .module('app.ui', [
        BusySpinnerModule,
        GlobalSpinnerModule,
    ])
    .name;
