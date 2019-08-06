// eslint-disable-next-line @typescript-eslint/no-unused-vars
import { AccessValue } from './access-value.model';

export class DenialAccessValue implements AccessValue<boolean> {

    public isAuthorized(): boolean {
        return false;
    }

    public routerResponse(): boolean {
        return false;
    }
}
