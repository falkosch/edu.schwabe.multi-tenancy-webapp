export class AppController {

    static $inject = ['$mdSidenav'];

    constructor($mdSidenav) {
        this.$mdSidenav = $mdSidenav;

        this.sideNavId = 'left';
    }

    toggleSideNav() {
        this.$mdSidenav(this.sideNavId)
            .toggle();
    }
}
