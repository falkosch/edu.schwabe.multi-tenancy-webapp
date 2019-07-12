import { Authorization } from './authorization.model';

export class AnonymousAuthorization extends Authorization {

    static Type = 'Anonymous';

    get key() {
        return undefined;
    }

    get type() {
        return AnonymousAuthorization.Type;
    }
}
