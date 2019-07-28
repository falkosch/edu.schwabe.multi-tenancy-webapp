import { Transition, TransitionService } from '@uirouter/core';
import { GlobalSpinnerServiceName, GlobalSpinnerService } from './global-spinner.service';

globalSpinnerUiRouterTransitionsRun.$inject = [
    '$transitions',
    GlobalSpinnerServiceName,
];

export function globalSpinnerUiRouterTransitionsRun(
    $transitions: TransitionService,
    globalSpinnerService: GlobalSpinnerService,
): void {

    $transitions.onBefore(
        {},
        (transition: Transition) => {
            globalSpinnerService.spinWhileTransition(transition);
        },
    );

}
