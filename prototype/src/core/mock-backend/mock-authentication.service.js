import uuidV4 from 'uuid-browser/v4';
import moment from 'moment';
import _ from 'lodash';

import {
    AuthenticationServiceName,
    Authorization,
    Permissions,
    AuthenticationService,
} from '../backend/authentication.service';
import { BackendErrors } from '../backend/backend-errors';
import { ProfileServiceName } from '../backend/profile.service';

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

        return this.$q.when(this.profileService.initializePromise)
            .then(profiles => this.$timeout(
                () => {

                    const firstProfile = _.head(profiles);
                    const id = _.get(firstProfile, 'login.uuid') || uuidV4();
                    const key = uuidV4();
                    const birthdate = moment().toDate();

                    return {
                        id,
                        authorization: {
                            type: Authorization.Basic,
                            key,
                        },
                        ident: {
                            id,
                            name: userNameClaim,
                            firstName: 'Mock',
                            lastName: 'User',
                            birthdate,
                        },
                        permissions: {
                            [id]: [Permissions.Read, Permissions.Write],
                            greet: [Permissions.Read],
                        },
                    };

                },
                MockAuthenticationService.MockDelay,
            ));

    }
}
