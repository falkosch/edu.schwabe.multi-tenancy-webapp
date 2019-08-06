import { TargetState } from '@uirouter/core';

// eslint-disable-next-line @typescript-eslint/no-unused-vars
import { AccessValue } from './access-value.model';

export class RedirectAccessValue implements AccessValue<TargetState> {

    public constructor(private targetState: TargetState) { }

    public isAuthorized(): boolean {
        return false;
    }

    public routerResponse(): TargetState {
        return this.targetState;
    }
}
