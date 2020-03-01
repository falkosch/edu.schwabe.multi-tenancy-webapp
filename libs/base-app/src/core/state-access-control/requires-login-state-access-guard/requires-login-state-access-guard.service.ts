import _ from 'lodash';
import { Transition } from '@uirouter/core';

import { UserStateServiceName } from '../../user-state/user-state.service';
import { UserState } from '../../user-state/models/user-state.model';
// eslint-disable-next-line @typescript-eslint/no-unused-vars
import { StateAccessGuard } from '../models/state-access-guard.model';
import { AccessValue } from '../models/access-value.model';
import { AllowanceAccessValue } from '../models/allowance-access-value.model';
import { RedirectAccessValue } from '../models/redirect-access-value.model';
import { DenialAccessValue } from '../models/denial-access-value.model';

export const RequiresLoginStateAccessGuardServiceName = 'requiresLoginStateAccessGuardService';

export class RequiresLoginStateAccessGuardService implements StateAccessGuard {
    public static $inject = ['$q', UserStateServiceName];

    private loginStateName?: string;

    public constructor(private $q: angular.IQService, private userStateService: UserState) { }

    public setLoginStateName(value: string): void {
        this.loginStateName = value;
    }

    public authorize(
        transition: Transition,
        requiresLogin: boolean,
    ): angular.IPromise<AccessValue> {
        if (!requiresLogin || this.userStateService.isLoggedIn) {
            return this.$q.resolve(new AllowanceAccessValue());
        }

        if (_.isNil(this.loginStateName)) {
            return this.$q.resolve(new DenialAccessValue());
        }

        return this.$q.resolve(
            new RedirectAccessValue(
                transition.router.stateService.target(this.loginStateName),
            ),
        );
    }
}
