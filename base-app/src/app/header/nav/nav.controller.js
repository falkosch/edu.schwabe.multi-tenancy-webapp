import { NavigationServiceName } from '../../../core/navigation/navigation.service';

export class NavController {

    static $inject = [
        '$scope',
        NavigationServiceName,
    ];

    sideNav;

    constructor($scope, navigationService) {
        this.$scope = $scope;
        this.navigationService = navigationService;
    }

    $onInit() {
        this.$scope.$watchCollection(
            () => this.navigationService.entries,
            (v) => { this.entries = v; },
        );
    }

    onClickNavLink() {
        if (this.sideNav) {
            this.sideNav.close();
        }
    }
}
