import { Authorization } from './authorization.model';
import { Ident } from './ident.model';
import { Permissions } from './permissions.model';

export class Authentication {

    public authorization = new Authorization();

    public permissions = new Permissions();

    public constructor(public ident: Ident) { }

    public setAuthorization(value: Authorization): Authentication {
        this.authorization = value;
        return this;
    }

    public setIdent(value: Ident): Authentication {
        this.ident = value;
        return this;
    }

    public setPermissions(value: Permissions): Authentication {
        this.permissions = value;
        return this;
    }

    public get id(): string {
        return this.ident.id;
    }
}
