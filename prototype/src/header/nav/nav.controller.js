import { NavServiceName } from './nav.service';

export class NavController {

    static $inject = [
        '$scope',
        NavServiceName,
    ];

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
}
