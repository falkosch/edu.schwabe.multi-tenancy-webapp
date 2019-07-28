import { Authorization } from './authorization.model';

export class BasicAuthorization extends Authorization {

    public static Type = 'Basic';

    public key?: string;

    public setKey(value: string): BasicAuthorization {
        this.key = value;
        return this;
    }

    public get type(): string {
        return BasicAuthorization.Type;
    }
}
