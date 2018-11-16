import angular from 'angular';

import { BusySpinnerName, BusySpinnerComponent } from './busy-spinner.component';

export const BusySpinnerModule = angular
    .module('app.ui.busy-spinner', [
    ])
    .component(BusySpinnerName, BusySpinnerComponent)
    .name;
