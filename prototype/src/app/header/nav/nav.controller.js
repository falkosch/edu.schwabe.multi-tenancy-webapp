import { NavigationServiceName } from '../../../core/navigation/navigation.service';

export class NavController {

    static $inject = [
        '$scope',
        NavigationServiceName,
    ];

    sideNav;

    constructor($scope, navService) {
        this.$scope = $scope;
        this.navService = navService;
    }

    $onInit() {
        this.$scope.$watchCollection(
            () => this.navService.entries,
            (v) => { this.entries = v; },
        );
    }

    onClickNavLink() {
        if (this.sideNav) {
            this.sideNav.close();
        }
    }
}
