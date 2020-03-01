import uuidV4 from 'uuid-browser/v4';
import moment from 'moment';
import _ from 'lodash';

import { AuthenticationServiceName, AuthenticationService } from '../backend/authentication.service';
import { BackendErrors } from '../backend/backend-errors';
import { ProfileServiceName, ProfileService } from '../backend/profile.service';
import { Authentication } from '../backend/models/authentication.model';
import { BasicAuthorization } from '../backend/models/basic-authorization.model';
import { IdentWithProfile } from '../backend/models/ident-with-profile.model';
import { PermissionsWithDefault } from '../backend/models/permissions-with-default.model';

export const MockAuthenticationServiceName = AuthenticationServiceName;

export class MockAuthenticationService extends AuthenticationService {

    public static $inject = [
        '$timeout',
        '$q',
        ProfileServiceName,
    ];

    public static MockDelay = 500;

    public constructor(
        private $timeout: angular.ITimeoutService,
        $q: angular.IQService,
        private profileService: ProfileService,
    ) { super($q); }

    public authenticate(
        userNameClaim: string,
        userPasswordProof: string,
    ): angular.IPromise<Authentication> {
        if (_.isNil(userPasswordProof) || _.isEmpty(userPasswordProof)) {
            return this.$q.reject(BackendErrors.missingUserPasswordProof());
        }

        return this.profileService.loadProfiles()
            .then(
                (profiles) => this.$timeout(_.noop, MockAuthenticationService.MockDelay)
                    .then(() => {
                        const firstProfile = _.head(profiles);
                        const id = _.get(firstProfile, 'login.uuid') || uuidV4();
                        const key = uuidV4();

                        const identWithProfile = new IdentWithProfile(id)
                            .setName(userNameClaim)
                            .setFirstName(_.get(firstProfile, 'name.first', 'Mock'))
                            .setLastName(_.get(firstProfile, 'name.last', 'User'))
                            .setBirthdate(moment().toDate());

                        return new Authentication(identWithProfile)
                            .setAuthorization(new BasicAuthorization().setKey(key))
                            .setPermissions(
                                new PermissionsWithDefault()
                                    .setDefault(id)
                                    .setPermission('greet', true, false),
                            );
                    }),
            );
    }
}
