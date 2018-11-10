import angular from 'angular';
import { PromiseTrackerModule } from './promise-tracker/promise-tracker.module';

export const CoreModule = angular
    .module('app.core', [
        PromiseTrackerModule,
    ])
    .name;
