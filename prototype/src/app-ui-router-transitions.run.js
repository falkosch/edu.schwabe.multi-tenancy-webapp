import { PromiseTrackerServiceName } from './core/promise-tracker/promise-tracker.service';

appUiRouterTransitionsRun.$inject = ['$q', '$transitions', PromiseTrackerServiceName];

export function appUiRouterTransitionsRun(
    $q,
    $transitions,
    promiseTrackerService,
) {

    $transitions.onBefore({}, (transition) => {

        const criteria = {
            from: transition.from().name,
            to: transition.to().name,
        };
        const deferred = $q.defer();
        promiseTrackerService.track(deferred.promise);

        let onSuccessDisposal;
        let onErrorDisposal;

        onSuccessDisposal = $transitions.onSuccess(criteria, () => {
            cleanUpDisposals();
            deferred.resolve();
        });

        onErrorDisposal = $transitions.onError(criteria, () => {
            cleanUpDisposals();
            deferred.reject();
        });

        function cleanUpDisposals() {
            if (onSuccessDisposal) {
                onSuccessDisposal();
                onSuccessDisposal = undefined;
            }
            if (onErrorDisposal) {
                onErrorDisposal();
                onErrorDisposal = undefined;
            }
        }

    });

}
