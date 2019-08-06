import { Authorization } from './authorization.model';

export class BearerAuthorization extends Authorization {

    public static Type = 'Bearer';

    public key?: string;

    public setKey(value: string): BearerAuthorization {
        this.key = value;
        return this;
    }

    public get type(): string {
        return BearerAuthorization.Type;
    }
}
