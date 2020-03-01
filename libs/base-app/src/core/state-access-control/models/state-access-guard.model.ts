import { Transition } from '@uirouter/core';

import { AccessValue } from './access-value.model';

export type StateAccessGuardAuthorizeParameters = boolean | number | string | Record<string, any>

export interface StateAccessGuard {
    authorize(
        transition: Transition,
        parameters: StateAccessGuardAuthorizeParameters
    ): angular.IPromise<AccessValue>;
}
