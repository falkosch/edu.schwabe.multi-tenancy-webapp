import _ from 'lodash';

import { RequireLoginAccessControlServiceName } from './require-login-access-control.service';

export const AccessControlServiceName = 'accessControlService';

export class AccessControlService {

    static $inject = [
        '$injector',
        '$q',
        '$log',
    ];

    guards = {
        requireLogin: {
            serviceName: RequireLoginAccessControlServiceName,
        },
    };

    constructor($injector, $q, $log) {
        this.$injector = $injector;
        this.$q = $q;
        this.$log = $log;
    }

    authorizeAccessToState(transition) {

        return this._forEachGuard(
            (promise, guardService) => promise.then(
                (authorized) => {

                    if (!authorized) {
                        return authorized;
                    }

                    return guardService.authorizeAccessToState(transition);
                },
            ),
        );
    }

    _forEachGuard(iteratee) {

        const intermediates = {};

        return _.reduce(
            this.guards,
            (promise, guard, guardId) => this._nextGuard(
                iteratee,
                guardId,
                intermediates,
                promise,
                guard,
            ),
            this.$q.when(true),
        ).finally(
            () => this.$log.debug(intermediates),
        );
    }

    _nextGuard(iteratee, guardId, intermediates, promise, guard) {
        const guardService = this._getGuardService(guard);
        const nextPromise = iteratee(promise, guardService);

        return nextPromise
            .then((intermediate) => {
                intermediates[guardId] = _.cloneDeep(intermediate);
                return intermediate;
            });
    }

    _getGuardService(guard) {
        const guardService = guard.$cachedService;

        if (_.isObject(guardService)) {
            return guardService;
        }

        return (guard.$cachedService = this.$injector.get(guard.serviceName));
    }

}
