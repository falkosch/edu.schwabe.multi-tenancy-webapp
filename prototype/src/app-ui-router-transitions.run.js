import { AppServiceName } from './app.service';

appUiRouterTransitionsRun.$inject = [
    '$transitions',
    AppServiceName,
];

export function appUiRouterTransitionsRun(
    $transitions,
    appService,
) {

    $transitions.onBefore(
        {},
        transition => appService.handleBeforeTransition(transition),
    );

}
