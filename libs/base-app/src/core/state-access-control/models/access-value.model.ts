import { HookResult } from '@uirouter/core';

export interface AccessValue {
    isAuthorized(): boolean;
    routerResponse(): HookResult;
}
