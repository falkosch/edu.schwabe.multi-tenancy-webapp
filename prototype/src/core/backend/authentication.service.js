import uuidV4 from 'uuid-browser/v4';

import { BackendErrors } from './backend-errors';
import { Authentication } from './models/authentication.model';
import { AnonymousAuthorization } from './models/anonymous-authorization.model';
import { Ident } from './models/ident.model';
import { PermissionsWithDefault } from './models/permissions-with-default.model';

export const AuthenticationServiceName = 'authenticationService';

export class AuthenticationService {

    static $inject = ['$q'];

    constructor($q) {
        this.$q = $q;
    }

    authenticate() {
        return this.$q.reject(BackendErrors.notImplemented());
    }

    get anonymous() {
        const anonymousId = uuidV4();
        return new Authentication()
            .setAuthorization(new AnonymousAuthorization())
            .setIdent(new Ident().setId(anonymousId))
            .setPermissions(new PermissionsWithDefault().setDefault(anonymousId));
    }
}
