import { Authorization } from './authorization.model';
import { Ident } from './ident.model';
import { Permissions } from './permissions.model';

export class Authentication {

    authorization = new Authorization();

    ident = new Ident();

    permissions = new Permissions();

    setAuthorization(value) {
        this.authorization = value;
        return this;
    }

    setIdent(value) {
        this.ident = value;
        return this;
    }

    setPermissions(value) {
        this.permissions = value;
        return this;
    }

    get id() {
        if (this.ident) {
            return this.ident.id;
        }
        return undefined;
    }
}
