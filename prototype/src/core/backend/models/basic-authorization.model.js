import { Authorization } from './authorization.model';

export class BasicAuthorization extends Authorization {

    static Type = 'Basic';

    key;

    setKey(value) {
        this.key = value;
        return this;
    }

    get type() {
        return BasicAuthorization.Type;
    }
}
