import _ from 'lodash';

import { GlobalSpinnerServiceName } from '../ui/global-spinner/global-spinner.service';

export class ProfileController {

    static $inject = [
        '$q',
        GlobalSpinnerServiceName,
    ];

    _enabledControls = [];

    viewmodel;

    constructor($q, globalSpinnerService) {
        this.$q = $q;
        this.globalSpinnerService = globalSpinnerService;
    }

    isEnabled(controlName) {
        return _.includes(this._enabledControls, controlName);
    }

    enableControl(controlName) {
        if (!_.isString(controlName)) {
            return false;
        }
        if (_.includes(this._enabledControls, controlName)) {
            return true;
        }

        this._enabledControls = [...this._enabledControls, controlName];

        return true;
    }

    submit() {
        return this.globalSpinnerService.spinWhilePromise(
            this.$q.resolve()
                .then(() => this.viewmodel.save()),
        );
    }
}
