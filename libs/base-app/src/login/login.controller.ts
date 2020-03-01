import _ from 'lodash';

import { UserStateServiceName, UserStateService } from '../core/user-state/user-state.service';
import { GlobalSpinnerServiceName, GlobalSpinnerService } from '../ui/global-spinner/global-spinner.service';
import { Authentication } from '../core/backend/models/authentication.model';

export class LoginController {

    public static $inject = [
        UserStateServiceName,
        GlobalSpinnerServiceName,
        '$mdDialog',
        '$translate',
    ];

    public $loginForm?: angular.IFormController;

    public username = '';

    public password = '';

    public constructor(
        private userStateService: UserStateService,
        private globalSpinnerService: GlobalSpinnerService,
        private $mdDialog: angular.material.IDialogService,
        private $translate: angular.translate.ITranslateService,
    ) { }

    public login(): angular.IPromise<Authentication | void> {
        return this.globalSpinnerService
            .spinWhilePromise(
                this.userStateService.login(this.username, this.password),
            )
            .catch((e: Error) => this._handleLoginError(e));
    }

    private _handleLoginError(e: Error): angular.IPromise<void> {
        const translationKeys = {
            title: 'login.failed.title',
            confirm: 'login.failed.confirm',
        };

        return (
            this.$translate(_.values(translationKeys))
                .then(
                    (translations: Record<string, string>) => this.$mdDialog.show(
                        this.$mdDialog
                            .alert()
                            .clickOutsideToClose(true)
                            .title(translations[translationKeys.title])
                            .textContent(e.message)
                            .ok(translations[translationKeys.confirm])
                            .ariaLabel(translations[translationKeys.title]),
                    ),
                )
        );
    }
}
