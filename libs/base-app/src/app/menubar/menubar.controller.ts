import _ from 'lodash';

import { StateService } from '@uirouter/core';
import { UserStateServiceName, UserStateService } from '../../core/user-state/user-state.service';
import {
    ProfileServiceName, ProfileService, Profile, ProfileName,
} from '../../core/backend/profile.service';
import { GlobalSpinnerServiceName, GlobalSpinnerService } from '../../ui/global-spinner/global-spinner.service';

import { Authentication } from '../../core/backend/models/authentication.model';

export class MenubarController implements angular.IController {

    public static $inject = [
        '$q',
        '$state',
        UserStateServiceName,
        ProfileServiceName,
        GlobalSpinnerServiceName,
    ];

    public authentication?: Authentication;

    public profile?: Profile;

    private _onLoginSubscription = _.noop;

    private _onLogoutSubscription = _.noop;

    public constructor(
        private $q: angular.IQService,
        private $state: StateService,
        private userStateService: UserStateService,
        private profileService: ProfileService,
        private globalSpinnerService: GlobalSpinnerService,
    ) {
        this.$state = $state;
        this.userStateService = userStateService;
        this.profileService = profileService;
        this.globalSpinnerService = globalSpinnerService;
    }

    public $onInit(): void {
        this._onLoginSubscription = this.userStateService.onLogin
            .subscribe((__: angular.IAngularEvent, authentication: Authentication) => {
                this._onLogin(authentication);
            });

        this._onLogoutSubscription = this.userStateService.onLogout
            .subscribe(() => {
                this._onLogout();
            });

        if (this.userStateService.isLoggedIn) {
            this._onLogin(this.userStateService.authentication);
        }
    }

    public $onDestroy(): void {
        this._onLoginSubscription();
        this._onLoginSubscription = _.noop;
        this._onLogoutSubscription();
        this._onLogoutSubscription = _.noop;
    }

    public get currentStateTitle(): string {
        return _.get(this.$state.current, 'data.title', this.$state.current.name);
    }

    public get profileName(): ProfileName {
        return _.get(this.profile, 'name', {
            title: '',
            first: '',
            last: '',
        });
    }

    public logout(): angular.IPromise<void> {
        return this.globalSpinnerService.spinWhilePromise(
            this.userStateService.logout(),
        );
    }

    private _onLogin(authentication: Authentication): angular.IPromise<void> {
        this.authentication = authentication;

        return this.globalSpinnerService.spinWhilePromise(
            this.profileService
                .getProfile(authentication.id)
                .then((profile: Profile) => {
                    this.profile = profile;
                }),
        );
    }

    private _onLogout(): void {
        this.authentication = undefined;
        this.profile = undefined;
    }
}
