import { Transition } from '@uirouter/core';

import { PromiseTrackerServiceName, PromiseTrackerService } from '../../core/promise-tracker/promise-tracker.service';

export const GlobalSpinnerServiceName = 'globalSpinnerService';

export class GlobalSpinnerService {

    public static $inject = [
        PromiseTrackerServiceName,
    ];

    public constructor(
        private promiseTrackerService: PromiseTrackerService,
    ) { }

    public get isBusy(): boolean {
        return this.promiseTrackerService.isBusy;
    }

    public spinWhilePromise<T>(promise: angular.IPromise<T>): angular.IPromise<T> {
        return this.promiseTrackerService.track(promise);
    }

    public spinWhileTransition(transition: Transition): angular.IPromise<any> {
        return this.spinWhilePromise(transition.promise);
    }
}
