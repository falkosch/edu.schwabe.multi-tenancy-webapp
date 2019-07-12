stateAccessControlDecoratorConfig.$inject = ['$stateProvider'];

export const StateAccessControlProperty = 'accessControl';

export function stateAccessControlDecorator(state) {
    return state[StateAccessControlProperty] || {};
}

export function stateAccessControlDecoratorConfig(
    $stateProvider,
) {
    $stateProvider.decorator(StateAccessControlProperty, stateAccessControlDecorator);
}
