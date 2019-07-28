indexHtml5Config.$inject = ['$locationProvider'];

export function indexHtml5Config($locationProvider: angular.ILocationProvider): void {
    $locationProvider.html5Mode(true);
}
