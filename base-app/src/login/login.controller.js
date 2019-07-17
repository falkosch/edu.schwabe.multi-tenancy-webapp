import _ from 'lodash';

import { UserStateServiceName } from '../core/user-state/user-state.service';
import { GlobalSpinnerServiceName } from '../ui/global-spinner/global-spinner.service';

export class LoginController {

    static $inject = [
        UserStateServiceName,
        GlobalSpinnerServiceName,
        '$mdDialog',
        '$translate',
    ];

    $loginForm;

    username;

    password;

    constructor(
        userStateService,
        globalSpinnerService,
        $mdDialog,
        $translate,
    ) {
        this.userStateService = userStateService;
        this.globalSpinnerService = globalSpinnerService;
        this.$mdDialog = $mdDialog;
        this.$translate = $translate;
    }

    login() {
        return this.globalSpinnerService
            .spinWhilePromise(
                this.userStateService.login(this.username, this.password),
            )
            .catch(e => this._handleLoginError(e));
    }

    _handleLoginError(e) {
        const translationKeys = {
            title: 'login.failed.title',
            confirm: 'login.failed.confirm',
        };

        return (
            this.$translate(_.values(translationKeys))
                .then(
                    translations => this.$mdDialog.show(
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
