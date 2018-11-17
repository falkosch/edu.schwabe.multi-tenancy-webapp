accessControlStateDecoratorConfig.$inject = ['$stateProvider'];

export function accessControlStateDecoratorConfig(
    $stateProvider,
) {
    $stateProvider.decorator('accessControl', state => (state.accessControl || {}));
}
