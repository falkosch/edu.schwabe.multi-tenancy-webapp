import uuidV4 from 'uuid-browser/v4';
import moment from 'moment';
import _ from 'lodash';

import { AuthenticationServiceName, AuthenticationService } from '../backend/authentication.service';
import { BackendErrors } from '../backend/backend-errors';
import { ProfileServiceName } from '../backend/profile.service';
import { Authentication } from '../backend/models/authentication.model';
import { BasicAuthorization } from '../backend/models/basic-authorization.model';
import { IdentWithProfile } from '../backend/models/ident-with-profile.model';
import { PermissionsWithDefault } from '../backend/models/permissions-with-default.model';

export const MockAuthenticationServiceName = AuthenticationServiceName;

export class MockAuthenticationService extends AuthenticationService {

    static $inject = [
        '$timeout',
        '$q',
        ProfileServiceName,
    ];

    static MockDelay = 500;

    constructor($timeout, $q, profileService) {
        super($q);
        this.$timeout = $timeout;
        this.profileService = profileService;
    }

    authenticate(userNameClaim, userPasswordProof) {
        if (_.isNil(userPasswordProof) || _.isEmpty(userPasswordProof)) {
            return this.$q.reject(BackendErrors.missingUserPasswordProof());
        }

        return this.profileService.loadProfiles()
            .then(
                profiles => this.$timeout(_.noop, MockAuthenticationService.MockDelay)
                    .then(() => {
                        const firstProfile = _.head(profiles);
                        const id = _.get(firstProfile, 'login.uuid') || uuidV4();
                        const key = uuidV4();

                        return new Authentication()
                            .setAuthorization(new BasicAuthorization().setKey(key))
                            .setIdent(
                                new IdentWithProfile()
                                    .setId(id)
                                    .setName(userNameClaim)
                                    .setFirstName(_.get(firstProfile, 'name.first', 'Mock'))
                                    .setLastName(_.get(firstProfile, 'name.last', 'User'))
                                    .setBirthdate(moment().toDate()),
                            )
                            .setPermissions(
                                new PermissionsWithDefault()
                                    .setDefault(id)
                                    .setPermission('greet', true, false),
                            );
                    }),
            );
    }
}
