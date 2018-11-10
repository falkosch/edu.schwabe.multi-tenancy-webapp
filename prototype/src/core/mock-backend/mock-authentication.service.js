import uuidV4 from 'uuid-browser/v4';
import moment from 'moment';
import _ from 'lodash';

import { AuthenticationServiceName, Authorization, Permissions } from '../backend/authentication.service';
import { BackendErrors } from '../backend/backend-base';

export const MockAuthenticationServiceName = AuthenticationServiceName;

export class MockAuthenticationService {

    static $inject = [
        '$timeout',
        '$q',
    ];

    constructor($timeout, $q) {
        this.$timeout = $timeout;
        this.$q = $q;
    }

    authenticate(userNameClaim, userPasswordProof) {
        if (_.isNil(userPasswordProof)) {
            return this.$q.reject(BackendErrors.missingUserPasswordProof());
        }

        const id = uuidV4();

        const fakeAuthentication = () => ({
            id,
            authorization: {
                type: Authorization.Basic,
                key: uuidV4(),
            },
            ident: {
                id,
                name: userNameClaim,
                firstName: 'Mock',
                lastName: 'User',
                birthdate: moment().toDate(),
            },
            permissions: {
                [id]: [Permissions.Read, Permissions.Write],
                greet: [Permissions.Read],
            },
        });

        return this.$timeout(fakeAuthentication, 500);
    }
}
