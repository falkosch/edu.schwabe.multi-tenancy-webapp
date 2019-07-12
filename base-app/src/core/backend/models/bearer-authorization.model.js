import { Authorization } from './authorization.model';

export class BearerAuthorization extends Authorization {

    static Type = 'Bearer';

    key;

    setKey(value) {
        this.key = value;
        return this;
    }

    get type() {
        return BearerAuthorization.Type;
    }
}
