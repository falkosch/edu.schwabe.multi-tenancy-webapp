import angular from 'angular';

import { PromiseTrackerServiceName, PromiseTrackerService } from './promise-tracker.service';

export const PromiseTrackerModule = angular
    .module('app.core.promise-tracker', [
    ])
    .service(PromiseTrackerServiceName, PromiseTrackerService)
    .name;
