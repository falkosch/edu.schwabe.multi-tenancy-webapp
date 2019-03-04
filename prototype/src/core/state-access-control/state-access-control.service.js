import _ from 'lodash';

import { RequiresLoginStateAccessGuardServiceName } from './requires-login-state-access-guard/requires-login-state-access-guard.service';
import { stateAccessControlDecorator } from './state-access-control-decorator.config';

export const StateAccessControlServiceName = 'accessControlService';

export class StateAccessControlService {

    static $inject = [
        '$injector',
        '$q',
    ];

    guards = {
        requiresLogin: RequiresLoginStateAccessGuardServiceName,
    };

    constructor($injector, $q) {
        this.$injector = $injector;
        this.$q = $q;
    }

    authorize(transition) {
        const targetState = transition.to();
        const stateAccessControl = stateAccessControlDecorator(targetState);

        return this._forEachGuard(
            (promise, guardService, guardProperty) => promise.then(
                (authorized) => {
                    if (authorized) {
                        const guardParameters = stateAccessControl[guardProperty];
                        return this._authorizeUsingGuard(guardService, guardParameters);
                    }

                    // If at least one guard already signaled no authorization,
                    // than keep it not authorized.
                    return false;
                },
            ),
        );
    }

    _forEachGuard(iteratee) {
        return _.reduce(
            this.guards,
            (promise, guardServiceName, guardProperty) => {
                const guardService = this.$injector.get(guardServiceName);
                return iteratee(promise, guardService, guardProperty);
            },
            this.$q.resolve(true),
        );
    }

    _authorizeUsingGuard(guardService, guardParameters) {
        return guardService.authorize(guardParameters)
            .then((newAuthorized) => {
                if (newAuthorized) {
                    return true;
                }

                // Allow guard service to determine a redirection route when denying authorization
                this._routeOnNotAuthorized(guardService);
                return false;
            });
    }

    _routeOnNotAuthorized() {
    }

}
