import _ from 'lodash';

import { UserStateServiceName } from '../../core/user-state/user-state.service';
import { ProfileServiceName } from '../../core/backend/profile.service';
import { GlobalSpinnerServiceName } from '../../ui/global-spinner/global-spinner.service';

export class HeaderController {

    static $inject = [
        UserStateServiceName,
        ProfileServiceName,
        GlobalSpinnerServiceName,
    ];

    constructor(userStateService, profileService, globalSpinnerService) {
        this.userStateService = userStateService;
        this.profileService = profileService;
        this.globalSpinnerService = globalSpinnerService;
    }

    $onInit() {
        this._onLoginSubscription = this.userStateService
            .onLogin
            .subscribe((event, authentication) => this._onLogin(authentication));

        this._onLogoutSubscription = this.userStateService
            .onLogout
            .subscribe(() => this._onLogout());

        if (this.userStateService.isLoggedIn) {
            this.authentication = this.userStateService.authentication;
        }
    }

    $onDestroy() {
        if (this._onLoginSubscription) {
            this._onLoginSubscription.dispose();
            this._onLoginSubscription = undefined;
        }
        if (this._onLogoutSubscription) {
            this._onLogoutSubscription.dispose();
            this._onLogoutSubscription = undefined;
        }
    }

    get isLoggedIn() {
        return this.userStateService.isLoggedIn;
    }

    get profileName() {
        return _.get(this.profile, 'name', {});
    }

    _onLogin(authentication) {
        this.authentication = authentication;

        this.globalSpinnerService.spinWhilePromise(
            this.profileService
                .getProfile(this.authentication.id)
                .then((profile) => {
                    this.profile = profile;
                }),
        );
    }

    _onLogout() {
        this.authentication = undefined;
        this.profile = undefined;
    }
}
