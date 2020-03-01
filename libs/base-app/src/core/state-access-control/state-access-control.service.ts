import _ from 'lodash';
import { Transition } from '@uirouter/core';

import { RequiresLoginStateAccessGuardServiceName } from './requires-login-state-access-guard/requires-login-state-access-guard.service';
import { stateAccessControlDecorator } from './state-access-control-decorator.config';
import { StateAccessGuard } from './models/state-access-guard.model';
import { AccessValue } from './models/access-value.model';
import { AllowanceAccessValue } from './models/allowance-access-value.model';

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

    public authorize(
        transition: Transition,
    ): angular.IPromise<AccessValue> {
        const targetState = transition.to();
        const stateAccessControl = stateAccessControlDecorator(targetState);

        return this._forEachGuard(
            (
                promise: angular.IPromise<AccessValue>,
                guardService: StateAccessGuard,
                guardProperty: string,
            ) => promise.then((currentAccessValue: AccessValue) => {
                if (currentAccessValue.isAuthorized()) {
                    const guardParameters = stateAccessControl[guardProperty];
                    return guardService.authorize(transition, guardParameters);
                }

                // If at least one guard already signaled "not authorized",
                // than keep that value.
                return currentAccessValue;
            }),
        );
    }

    private _forEachGuard(
        iteratee: (
            promise: angular.IPromise<AccessValue>,
            guardService: StateAccessGuard,
            guardProperty: string,
        ) => angular.IPromise<AccessValue>,
    ): angular.IPromise<AccessValue> {
        return _.reduce(
            this.guards,
            (
                promise: angular.IPromise<AccessValue>,
                guardServiceName: string,
                guardProperty: string,
            ) => {
                const guardService = this.$injector.get<StateAccessGuard>(guardServiceName);
                return iteratee(promise, guardService, guardProperty);
            },
            this.$q.resolve(new AllowanceAccessValue()),
        );
    }
}
