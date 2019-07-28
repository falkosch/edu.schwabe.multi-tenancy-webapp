export interface StateAccessGuard {
    authorize(requiresLogin: boolean): angular.IPromise<boolean>;
    routeOnNotAuthorized?(): angular.IPromise<any>;
}
