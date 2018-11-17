import { AccessControlServiceName } from './access-control.service';

accessControlUiRouterTransitionsRun.$inject = [
    '$transitions',
    AccessControlServiceName,
];

export function accessControlUiRouterTransitionsRun(
    $transitions,
    accessControlService,
) {

    $transitions.onBefore(
        {},
        transition => accessControlService.authorizeAccessToState(transition),
    );

}
