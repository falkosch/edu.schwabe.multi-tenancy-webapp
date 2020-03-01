import { GlobalSpinnerServiceName, GlobalSpinnerService } from '../ui/global-spinner/global-spinner.service';

export class AppController {

    public static $inject = [
        '$mdSidenav',
        GlobalSpinnerServiceName,
    ];

    public sideNavId = 'left';

    public constructor(
        private $mdSidenav: angular.material.ISidenavService,
        private globalSpinnerService: GlobalSpinnerService,
    ) { }

    public get isBusy(): boolean {
        return this.globalSpinnerService.isBusy;
    }

    public toggleSideNav(): void {
        this.$mdSidenav(this.sideNavId)
            .toggle();
    }
}
