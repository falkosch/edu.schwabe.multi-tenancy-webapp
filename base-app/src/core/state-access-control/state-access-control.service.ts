import _ from 'lodash';
import { Transition } from '@uirouter/core';

import { RequiresLoginStateAccessGuardServiceName } from './requires-login-state-access-guard/requires-login-state-access-guard.service';
import { stateAccessControlDecorator } from './state-access-control-decorator.config';
import { StateAccessGuard } from './models/state-access-guard.model';

export const StateAccessControlServiceName = 'accessControlService';

export class StateAccessControlService {

    public static $inject = [
        '$injector',
        '$q',
    ];

    public guards: Record<string, string> = {
        requiresLogin: RequiresLoginStateAccessGuardServiceName,
    };

    public constructor(
        private $injector: angular.auto.IInjectorService,
        private $q: angular.IQService,
    ) { }

    public authorize(transition: Transition): angular.IPromise<boolean> {
        const targetState = transition.to();
        const stateAccessControl = stateAccessControlDecorator(targetState);

        return this._forEachGuard(
            (
                promise: angular.IPromise<boolean>,
                guardService: StateAccessGuard,
                guardProperty: string,
            ) => promise.then((authorized: boolean) => {
                if (authorized) {
                    const guardParameters = stateAccessControl[guardProperty];
                    return this.authorizeUsingGuard(guardService, guardParameters);
                }

                // If at least one guard already signaled no authorization,
                // than keep it not authorized.
                return false;
            }),
        );
    }

    private _forEachGuard(
        iteratee: (
            promise: angular.IPromise<boolean>,
            guardService: StateAccessGuard,
            guardProperty: string,
        ) => angular.IPromise<boolean>,
    ): angular.IPromise<boolean> {
        return _.reduce(
            this.guards,
            (
                promise: angular.IPromise<boolean>,
                guardServiceName: string,
                guardProperty: string,
            ) => {
                const guardService = this.$injector.get<StateAccessGuard>(guardServiceName);
                return iteratee(promise, guardService, guardProperty);
            },
            this.$q.resolve(true),
        );
    }


    private authorizeUsingGuard(
        guardService: StateAccessGuard,
        guardParameters: any,
    ): angular.IPromise<boolean> {
        return guardService.authorize(guardParameters)
            .then((newAuthorized) => {
                if (newAuthorized) {
                    return true;
                }

                // Allow guard service to determine a redirection route when denying authorization
                return this.routeOnNotAuthorized(guardService)
                    // after redirection routing, emit return non-authorized state to caller
                    .then(() => false);
            });
    }

    private routeOnNotAuthorized(guardService: StateAccessGuard): angular.IPromise<any> {
        if (guardService.routeOnNotAuthorized) {
            return guardService.routeOnNotAuthorized();
        }
        return this.$q.resolve();
    }

}
