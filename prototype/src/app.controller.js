import _ from 'lodash';

import { GlobalSpinnerServiceName } from './ui/global-spinner/global-spinner.service';

export class AppController {

    static $inject = [
        '$state',
        '$mdSidenav',
        GlobalSpinnerServiceName,
    ];

    constructor($state, $mdSidenav, globalSpinnerService) {
        this.$state = $state;
        this.$mdSidenav = $mdSidenav;
        this.globalSpinnerService = globalSpinnerService;

        this.sideNavId = 'left';
    }

    get currentStateTitle() {
        return _.get(this.$state.current, 'data.title', this.$state.current.name);
    }

    get isBusy() {
        return this.globalSpinnerService.isBusy;
    }

    toggleSideNav() {
        this.$mdSidenav(this.sideNavId)
            .toggle();
    }
}
