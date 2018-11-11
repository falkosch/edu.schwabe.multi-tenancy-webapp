appHtml5Config.$inject = ['$locationProvider'];

export function appHtml5Config(
    $locationProvider,
) {
    $locationProvider.html5Mode(true);
}
