import { GlobalSpinnerServiceName } from './ui/global-spinner/global-spinner.service';

export class AppController {

    static $inject = [
        '$state',
        '$mdSidenav',
        GlobalSpinnerServiceName,
    ];

    constructor($state, $mdSidenav, globalSpinnerService) {
        this.$mdSidenav = $mdSidenav;
        this.globalSpinnerService = globalSpinnerService;

        this.sideNavId = 'left';
    }

    get isBusy() {
        return this.globalSpinnerService.isBusy;
    }

    toggleSideNav() {
        this.$mdSidenav(this.sideNavId)
            .toggle();
    }
}
