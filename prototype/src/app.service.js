import angular from 'angular';

import { PromiseTrackerServiceName } from './core/promise-tracker/promise-tracker.service';

export const AppServiceName = 'appService';

export class AppService {

    static $inject = [
        '$q',
        '$transitions',
        PromiseTrackerServiceName,
    ];

    constructor(
        $q,
        $transitions,
        promiseTrackerService,
    ) {
        this.$q = $q;
        this.$transitions = $transitions;
        this.promiseTrackerService = promiseTrackerService;
    }

    handleBeforeTransition(transition) {

        const criteria = {
            from: transition.from().name,
            to: transition.to().name,
        };

        const deferred = this.$q.defer();
        this.promiseTrackerService.track(deferred.promise);

        let onSuccessDisposal;
        let onErrorDisposal;

        function cleanUpDisposals() {
            if (angular.isFunction(onSuccessDisposal)) {
                onSuccessDisposal();
            }
            if (angular.isFunction(onErrorDisposal)) {
                onErrorDisposal();
            }
        }

        onSuccessDisposal = this.$transitions.onSuccess(criteria, () => {
            cleanUpDisposals();
            deferred.resolve();
        });

        onErrorDisposal = this.$transitions.onError(criteria, () => {
            cleanUpDisposals();
            deferred.reject();
        });

    }

}
