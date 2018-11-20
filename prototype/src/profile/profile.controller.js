import { GlobalSpinnerServiceName } from '../ui/global-spinner/global-spinner.service';

export class ProfileController {

    static $inject = [
        '$q',
        GlobalSpinnerServiceName,
    ];

    enabled = [];

    profileForm;

    viewmodel;

    constructor($q, globalSpinnerService) {
        this.$q = $q;
        this.globalSpinnerService = globalSpinnerService;
    }

    enableControl(controlName) {
        this.enabled.push(controlName);
    }

    submit() {
        this.globalSpinnerService.spinWhilePromise(
            this.$q.when()
                .then(() => this.viewmodel.save()),
        );
    }
}
