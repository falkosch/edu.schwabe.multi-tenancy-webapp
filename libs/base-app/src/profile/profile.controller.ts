import _ from 'lodash';

import { GlobalSpinnerServiceName, GlobalSpinnerService } from '../ui/global-spinner/global-spinner.service';
import { ProfileView } from './models/profile-view.model';

export const ProfileViewBindingName: keyof ProfileController = 'view';

export class ProfileController {

    public static $inject = [
        '$q',
        GlobalSpinnerServiceName,
    ];

    private _enabledControls: string[] = [];

    public view?: ProfileView;

    public constructor(
        private $q: angular.IQService,
        private globalSpinnerService: GlobalSpinnerService,
    ) { }

    public isEnabled(controlName: string): boolean {
        return _.includes(this._enabledControls, controlName);
    }

    public enableControl(controlName: string): void {
        if (!this.isEnabled(controlName)) {
            this._enabledControls = [...this._enabledControls, controlName];
        }
    }

    public submit(): angular.IPromise<void> {
        return this.globalSpinnerService.spinWhilePromise(
            this.$q.resolve()
                .then(() => {
                    if (_.isNil(this.view)) {
                        return;
                    }

                    this.view.save();
                }),
        );
    }
}
