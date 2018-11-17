import { UserStateServiceName } from '../core/user-state/user-state.service';
import { GlobalSpinnerServiceName } from '../ui/global-spinner/global-spinner.service';

export class LoginController {

    static $inject = [
        UserStateServiceName,
        GlobalSpinnerServiceName,
        '$mdDialog',
    ];

    $loginForm;

    username;

    password;

    constructor(userStateService, globalSpinnerService, $mdDialog) {
        this.userStateService = userStateService;
        this.globalSpinnerService = globalSpinnerService;
        this.$mdDialog = $mdDialog;
    }

    login() {
        return this.globalSpinnerService.spinWhilePromise(
            this.userStateService.login(this.username, this.password)
                .catch((e) => {
                    this._handleLoginError(e);
                }),
        );
    }

    _handleLoginError(e) {
        return this.$mdDialog.show(
            this.$mdDialog
                .alert()
                .clickOutsideToClose(true)
                .title('Login failed')
                .textContent(e.message)
                .ok('Ok')
                .ariaLabel('Alert Dialog Demo'),
        );
    }
}
