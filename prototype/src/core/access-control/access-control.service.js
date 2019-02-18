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
            (promise, guard, guardId) => {
                const guardService = this.$injector.get(guard.serviceName);
                return iteratee(promise, guardService)
                    .then((intermediate) => {
                        intermediates[guardId] = _.cloneDeep(intermediate);
                        return intermediate;
                    });
            },
            this.$q.resolve(true),
        );
    }

}
