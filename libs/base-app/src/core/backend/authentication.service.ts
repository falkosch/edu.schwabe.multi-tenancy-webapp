import uuidV4 from 'uuid-browser/v4';

import { BackendErrors } from './backend-errors';
import { Authentication } from './models/authentication.model';
import { AnonymousAuthorization } from './models/anonymous-authorization.model';
import { Ident } from './models/ident.model';
import { PermissionsWithDefault } from './models/permissions-with-default.model';

export const AuthenticationServiceName = 'authenticationService';

export class AuthenticationService {

    public static $inject = ['$q'];

    public constructor(protected $q: angular.IQService) { }

    public authenticate(
        __userNameClaim: string,
        __userPasswordProof: string,
    ): angular.IPromise<Authentication> {
        return this.$q.reject(BackendErrors.notImplemented());
    }

    public anonymous(): Authentication {
        const anonymousId = uuidV4();
        return new Authentication(new Ident(anonymousId))
            .setAuthorization(new AnonymousAuthorization())
            .setPermissions(new PermissionsWithDefault().setDefault(anonymousId));
    }
}
