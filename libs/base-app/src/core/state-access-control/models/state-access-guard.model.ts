import { Transition } from '@uirouter/core';

import { AccessValue } from './access-value.model';

export interface StateAccessGuard {
    authorize(transition: Transition, requiresLogin: boolean): angular.IPromise<AccessValue<any>>;
}
