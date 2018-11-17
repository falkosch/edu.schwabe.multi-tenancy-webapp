import _ from 'lodash';

import { UserStateServiceName } from '../core/user-state/user-state.service';

export class HeaderController {

    static $inject = [
        UserStateServiceName,
    ];

    constructor(userStateService) {
        this.userStateService = userStateService;
    }

    get isLoggedIn() {
        return this.userStateService.isLoggedIn;
    }

    get ident() {
        return _.get(this.userStateService.userState, 'authentication.ident');
    }
}
