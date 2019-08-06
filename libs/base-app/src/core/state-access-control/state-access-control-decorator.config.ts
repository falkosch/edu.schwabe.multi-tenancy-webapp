import { StateProvider, StateObject, Ng1StateDeclaration } from '@uirouter/angularjs';

stateAccessControlDecoratorConfig.$inject = ['$stateProvider'];

export const StateAccessControlProperty = 'accessControl';

export function stateAccessControlDecorator(
    state: StateObject | Ng1StateDeclaration,
): any {
    return state[StateAccessControlProperty] || {};
}

export function stateAccessControlDecoratorConfig(
    $stateProvider: StateProvider,
): void {
    $stateProvider.decorator(StateAccessControlProperty, stateAccessControlDecorator);
}
