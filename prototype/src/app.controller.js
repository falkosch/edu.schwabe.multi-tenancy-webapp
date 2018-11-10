import { PromiseTrackerServiceName } from './core/promise-tracker/promise-tracker.service';

export class AppController {

    static $inject = [
        '$mdSidenav',
        PromiseTrackerServiceName,
    ];

    constructor($mdSidenav, promiseTrackerService) {
        this.$mdSidenav = $mdSidenav;
        this.promiseTrackerService = promiseTrackerService;

        this.sideNavId = 'left';
    }

    get isBusy() {
        return this.promiseTrackerService.isBusy;
    }

    toggleSideNav() {
        this.$mdSidenav(this.sideNavId)
            .toggle();
    }
}
