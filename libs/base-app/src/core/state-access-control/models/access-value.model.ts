export interface AccessValue<T> {
    isAuthorized(): boolean;
    routerResponse(): T;
}
