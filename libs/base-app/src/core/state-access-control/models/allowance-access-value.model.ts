// eslint-disable-next-line @typescript-eslint/no-unused-vars
import { AccessValue } from './access-value.model';

export class AllowanceAccessValue implements AccessValue {

    public isAuthorized(): boolean {
        return true;
    }

    public routerResponse(): boolean {
        return true;
    }
}
