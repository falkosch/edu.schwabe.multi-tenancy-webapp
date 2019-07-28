import { NavigationServiceName, NavigationEntry, NavigationService } from '../../../core/navigation/navigation.service';

export class NavController implements angular.IController {

    public static $inject = [
        '$scope',
        NavigationServiceName,
    ];

    public sideNav?: angular.material.ISidenavObject;

    public entries: NavigationEntry[] = [];

    public constructor(
        private $scope: angular.IScope,
        private navigationService: NavigationService,
    ) { }

    public $onInit(): void {
        this.$scope.$watchCollection(
            () => this.navigationService.entries,
            (v: NavigationEntry[]) => { this.entries = v; },
        );
    }

    public onClickNavLink(): void {
        if (this.sideNav) {
            this.sideNav.close();
        }
    }
}
