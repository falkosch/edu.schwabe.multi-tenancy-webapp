import _ from 'lodash';

/**
 * Implementation of a simple promise tracker.
 */
export class PromiseTracker {

    private tracked: angular.IPromise<any>[] = [];

    /**
     * Tracks a promise until it is finished.
     *
     * @param promise any promise
     * @return the same promise
     */
    public track<T>(promise: angular.IPromise<T>): angular.IPromise<T> {
        this.tracked.push(promise);

        return promise.finally(() => {
            this.tracked = _.without(this.tracked, promise);
        });
    }

    /**
     * @return {boolean} true if all tracked promises are finished. If at least one tracked
     *      promise is still ongoing, than false is returned.
     */
    public get isIdling(): boolean {
        return _.isEmpty(this.tracked);
    }

    /**
     * @return {boolean} false if all tracked promises are finished. If at least one tracked
     *      promise is still ongoing, than true is returned.
     */
    public get isBusy(): boolean {
        return !_.isEmpty(this.tracked);
    }
}
