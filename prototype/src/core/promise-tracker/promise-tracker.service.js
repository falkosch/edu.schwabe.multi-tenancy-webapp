import angular from 'angular';
import _ from 'lodash';

export const PromiseTrackerServiceName = 'promiseTrackerService';

/**
 * Implementation of a simple promise tracker.
 */
class PromiseTracker {

    tracked = [];

    /**
     * Tracks a promise until it is finished.
     *
     * @param {angular.IPromise<any>} promise any promise
     * @return {angular.IPromise<any>} the same promise
     */
    track(promise) {
        if (promise && angular.isFunction(promise.finally)) {
            this.tracked.push(promise);
            
            promise.finally(() => {
                this.tracked = _.without(this.tracked, promise);
            });
        }

        return promise;
    }

    /**
     * @return {boolean} true if all tracked promises are finished. If at least one tracked
     *      promise is still ongoing, than false is returned.
     */
    get isIdling() {
        return _.isEmpty(this.tracked);
    }

    /**
     * @return {boolean} false if all tracked promises are finished. If at least one tracked
     *      promise is still ongoing, than true is returned.
     */
    get isBusy() {
        return !_.isEmpty(this.tracked);
    }
}

export class PromiseTrackerService extends PromiseTracker {

    static createTracker() {
        return new PromiseTracker();
    }
}
