import _ from 'lodash';

import { UserStateServiceName, UserStateService } from '../../core/user-state/user-state.service';
import {
    ProfileServiceName, ProfileService, Profile, ProfileName,
} from '../../core/backend/profile.service';
import { GlobalSpinnerServiceName, GlobalSpinnerService } from '../../ui/global-spinner/global-spinner.service';
import { LanguageServiceName, LanguageService } from '../../core/language/language.service';
import { Authentication } from '../../core/backend/models/authentication.model';

export class HeaderController implements angular.IController {

    public static $inject = [
        UserStateServiceName,
        ProfileServiceName,
        GlobalSpinnerServiceName,
        LanguageServiceName,
    ];

    public authentication?: Authentication;

    public profile?: Profile;

    private _onLoginSubscription = _.noop;

    private _onLogoutSubscription = _.noop;

    public constructor(
        private userStateService: UserStateService,
        private profileService: ProfileService,
        private globalSpinnerService: GlobalSpinnerService,
        private languageService: LanguageService,
    ) { }

    public $onInit(): void {
        this._onLoginSubscription = this.userStateService.onLogin.subscribe(
            (
                __: angular.IAngularEvent,
                authentication: Authentication,
            ) => { this._onLogin(authentication); },
        );

        this._onLogoutSubscription = this.userStateService.onLogout
            .subscribe(() => this._onLogout());

        if (this.userStateService.isLoggedIn) {
            this.authentication = this.userStateService.authentication;
        }
    }

    public $onDestroy(): void {
        this._onLoginSubscription();
        this._onLoginSubscription = _.noop;
        this._onLogoutSubscription();
        this._onLogoutSubscription = _.noop;
    }

    public get allAvailableLanguages(): string[] {
        return this.languageService.allAvailableLanguages;
    }

    public get currentLanguage(): string {
        return this.languageService.currentLanguage;
    }

    public get isLoggedIn(): boolean {
        return this.userStateService.isLoggedIn;
    }

    public get profileName(): ProfileName | undefined {
        return _.get(this.profile, 'name');
    }

    public changeLanguage(code: string): angular.IPromise<string> {
        return this.languageService.changeLanguage(code);
    }

    private _onLogin(authentication: Authentication): void {
        this.authentication = authentication;

        if (authentication.id) {
            this.globalSpinnerService.spinWhilePromise(
                this.profileService
                    .getProfile(authentication.id)
                    .then((profile: Profile) => {
                        this.profile = profile;
                    }),
            );
        }
    }

    private _onLogout(): void {
        this.authentication = undefined;
        this.profile = undefined;
    }
}
