import angular from 'angular';

import { BusySpinnerComponentName, BusySpinnerComponent } from './busy-spinner.component';

export const BusySpinnerModule = angular
    .module('app.ui.busy-spinner', [
    ])
    .component(BusySpinnerComponentName, BusySpinnerComponent)
    .name;
