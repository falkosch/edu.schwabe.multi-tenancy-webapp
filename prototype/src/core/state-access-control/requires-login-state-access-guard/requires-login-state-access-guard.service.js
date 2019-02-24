import { UserStateServiceName } from '../../user-state/user-state.service';

export const RequiresLoginStateAccessGuardServiceName = 'requiresLoginStateAccessGuardService';

export class RequiresLoginStateAccessGuardService {

    static $inject = [
        '$q',
        UserStateServiceName,
    ];

    constructor($q, userStateService) {
        this.$q = $q;
        this.userStateService = userStateService;
    }

    authorize(requiresLogin) {
        if (requiresLogin) {
            return this.$q.resolve(this.userStateService.isLoggedIn);
        }
        return this.$q.resolve(true);
    }

}
