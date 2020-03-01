import { StateProvider, StateObject, Ng1StateDeclaration } from '@uirouter/angularjs';

import { StateAccessControlValue, StateAccessControlProperty } from './models/state-access-control-value.model';

stateAccessControlDecoratorConfig.$inject = ['$stateProvider'];

export function stateAccessControlDecorator(
    state: StateObject | Ng1StateDeclaration,
): StateAccessControlValue {
    return state[StateAccessControlProperty] || {};
}

export function stateAccessControlDecoratorConfig(
    $stateProvider: StateProvider,
): void {
    $stateProvider.decorator(StateAccessControlProperty, stateAccessControlDecorator);
}
