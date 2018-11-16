import { GlobalSpinnerServiceName } from './global-spinner.service';

globalSpinnerUiRouterTransitionsRun.$inject = [
    '$transitions',
    GlobalSpinnerServiceName,
];

export function globalSpinnerUiRouterTransitionsRun(
    $transitions,
    globalSpinnerService,
) {

    $transitions.onBefore(
        {},
        (transition) => {
            globalSpinnerService.spinWhileTransition(transition);
        },
    );

}
