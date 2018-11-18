import _ from 'lodash';

import { UserStateServiceName } from '../core/user-state/user-state.service';
import { ProfileServiceName } from '../core/backend/profile.service';
import { GlobalSpinnerServiceName } from '../ui/global-spinner/global-spinner.service';

export class MenubarController {

    static $inject = [
        '$state',
        UserStateServiceName,
        ProfileServiceName,
        GlobalSpinnerServiceName,
    ];

    constructor($state, userStateService, profileService, globalSpinnerService) {
        this.$state = $state;
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

    get currentStateTitle() {
        return _.get(this.$state.current, 'data.title', this.$state.current.name);
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
