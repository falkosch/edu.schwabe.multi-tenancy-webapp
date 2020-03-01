import { Transition, TransitionService, TransitionHookFn } from '@uirouter/core';

import { StateAccessControlServiceName, StateAccessControlService } from './state-access-control.service';

stateAccessControlUiRouterTransitionsRun.$inject = [
    '$transitions',
    StateAccessControlServiceName,
];

export function onBeforeHookBuilder(
    stateAccessControlService: StateAccessControlService,
): TransitionHookFn {
    return (transition: Transition) => Promise.resolve(
        stateAccessControlService.authorize(transition)
            .then((accessValue) => accessValue.routerResponse()),
    );
}

export function stateAccessControlUiRouterTransitionsRun(
    $transitions: TransitionService,
    stateAccessControlService: StateAccessControlService,
): void {
    const onBeforeHook = onBeforeHookBuilder(stateAccessControlService);

    $transitions.onBefore({}, onBeforeHook);
}
