import { BackendErrors } from './backend-errors';

export const AuthenticationServiceName = 'authenticationService';

export class Authorization {

    key;

    setKey(value) {
        this.key = value;
        return this;
    }
}

export class BasicAuthorization extends Authorization {

    static Type = 'Basic';

    get type() {
        return BasicAuthorization.Type;
    }
}

export class BearerAuthorization extends Authorization {

    static Type = 'Bearer';

    get type() {
        return BearerAuthorization.Type;
    }
}

export class Ident {

    id;

    setId(value) {
        this.id = value;
        return this;
    }
}

export class IdentWithProfile extends Ident {

    name;

    firstName;

    lastName;

    birthdate;

    setName(value) {
        this.name = value;
        return this;
    }

    setFirstName(value) {
        this.firstName = value;
        return this;
    }

    setLastName(value) {
        this.lastName = value;
        return this;
    }

    setBirthdate(value) {
        this.birthdate = value;
        return this;
    }
}

export class Permissions {

    static Read = 'read';

    static Write = 'write';

    setPermission(token, read = true, write = false) {
        const permissions = [];
        if (read) {
            permissions.push(Permissions.Read);
        }
        if (write) {
            permissions.push(Permissions.Write);
        }
        return this.setPermissions(token, ...permissions);
    }

    setPermissions(token, ...permissions) {
        this[token] = permissions;
        return this;
    }
}

export class PermissionsWithDefault extends Permissions {

    setDefault(identId) {
        return this.setPermission(identId, true, true);
    }
}

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
        return (this.ident || {}).id;
    }
}

export class AuthenticationService {

    static $inject = ['$q'];

    constructor($q) {
        this.$q = $q;
    }

    authenticate() {
        return this.$q.reject(BackendErrors.notImplemented());
    }
}
