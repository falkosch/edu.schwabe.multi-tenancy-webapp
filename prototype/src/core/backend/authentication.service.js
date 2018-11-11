import { BackendErrors } from './backend-errors';

export const AuthenticationServiceName = 'authenticationService';

export class Authorization {
    static Basic = 'Basic';
}

export class Permissions {
    static Read = 'read';

    static Write = 'write';
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
