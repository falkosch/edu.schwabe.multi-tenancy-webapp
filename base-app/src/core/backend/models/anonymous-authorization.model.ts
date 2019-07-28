import { Authorization } from './authorization.model';

export class AnonymousAuthorization extends Authorization {

    public static Type = 'Anonymous';

    public get key(): undefined {
        return undefined;
    }

    public get type(): string {
        return AnonymousAuthorization.Type;
    }
}
