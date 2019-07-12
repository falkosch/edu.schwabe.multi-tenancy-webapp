import { PromiseTrackerServiceName } from '../../core/promise-tracker/promise-tracker.service';

export const GlobalSpinnerServiceName = 'globalSpinnerService';

export class GlobalSpinnerService {

    static $inject = [
        PromiseTrackerServiceName,
    ];

    constructor(
        promiseTrackerService,
    ) {
        this.promiseTrackerService = promiseTrackerService;
    }

    get isBusy() {
        return this.promiseTrackerService.isBusy;
    }

    spinWhilePromise(promise) {
        return this.promiseTrackerService.track(promise);
    }

    spinWhileTransition(transition) {
        return this.spinWhilePromise(transition.promise);
    }

}
