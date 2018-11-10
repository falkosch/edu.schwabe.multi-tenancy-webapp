import angular from 'angular';
import { BusySpinnerName, BusySpinnerComponent } from './busy-spinner/busy-spinner.component';

export const UiModule = angular
    .module('app.ui', [
    ])
    .component(BusySpinnerName, BusySpinnerComponent)
    .name;
