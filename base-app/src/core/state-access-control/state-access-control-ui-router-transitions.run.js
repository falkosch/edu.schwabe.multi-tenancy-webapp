import { StateAccessControlServiceName } from './state-access-control.service';

stateAccessControlUiRouterTransitionsRun.$inject = [
    '$transitions',
    StateAccessControlServiceName,
];

export function onBeforeHookBuilder(stateAccessControlService) {
    return transition => stateAccessControlService.authorize(transition);
}

export function stateAccessControlUiRouterTransitionsRun(
    $transitions,
    stateAccessControlService,
) {
    const onBeforeHook = onBeforeHookBuilder(stateAccessControlService);

    $transitions.onBefore({}, onBeforeHook);
}
