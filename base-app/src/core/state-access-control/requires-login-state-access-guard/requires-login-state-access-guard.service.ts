import { UserStateServiceName } from '../../user-state/user-state.service';
import { UserState } from '../../user-state/models/user-state.model';
// eslint-disable-next-line @typescript-eslint/no-unused-vars
import { StateAccessGuard } from '../models/state-access-guard.model';

export const RequiresLoginStateAccessGuardServiceName = 'requiresLoginStateAccessGuardService';

export class RequiresLoginStateAccessGuardService implements StateAccessGuard {

    public static $inject = [
        '$q',
        UserStateServiceName,
    ];

    public constructor(
        private $q: angular.IQService,
        private userStateService: UserState,
    ) {
        this.$q = $q;
        this.userStateService = userStateService;
    }

    public authorize(requiresLogin: boolean): angular.IPromise<boolean> {
        if (requiresLogin) {
            return this.$q.resolve(this.userStateService.isLoggedIn);
        }
        return this.$q.resolve(true);
    }

}
