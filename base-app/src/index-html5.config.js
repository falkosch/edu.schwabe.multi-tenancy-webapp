indexHtml5Config.$inject = ['$locationProvider'];

export function indexHtml5Config(
    $locationProvider,
) {
    $locationProvider.html5Mode(true);
}
