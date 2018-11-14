import _ from 'lodash';

import { MockAuthenticationServiceName, MockAuthenticationService } from './mock-authentication.service';
import { MockBackendModule } from './mock-backend.module';
import { BackendModule } from '../backend/backend.module';
import { AuthenticationServiceName, Authorization, Permissions } from '../backend/authentication.service';
import { BackendErrors } from '../backend/backend-errors';

describe(`${MockBackendModule}.${MockAuthenticationServiceName} implementing ${BackendModule}.${AuthenticationServiceName}`, () => {

    const testUserNameClaim = 'test';
    const testUserPasswordProof = 'password';

    let $q;
    let $timeout;
    let authenticationService;

    beforeEach(() => {

        angular.mock.module(MockBackendModule);

        inject((_$q_, _$timeout_, _authenticationService_) => {
            $q = _$q_;
            $timeout = _$timeout_;
            authenticationService = _authenticationService_;
        });

    });

    it(`should be an instanceof ${MockAuthenticationServiceName}`, () => {

        expect(authenticationService)
            .toEqual(jasmine.any(MockAuthenticationService));

    });

    describe('.authenticate', () => {

        it('should reject on missing, undefined, null or empty userPasswordProof', (done) => {

            function checkError(e) {

                expect(e)
                    .toEqual(jasmine.any(Error));

                expect(e.message)
                    .toEqual(BackendErrors.missingUserPasswordProof().message);

            }

            authenticationService
                .authenticate(testUserNameClaim)
                .catch(e => checkError(e))
                .then(() => _.reduce(
                    [undefined, null, ''],
                    (acc, password) => acc
                        .then(() => authenticationService.authenticate(testUserNameClaim, password))
                        .catch(e => checkError(e)),
                    $q.when(),
                ))
                .then(() => done())
                .catch(e => done(e));

            $timeout.flush();
            $timeout.verifyNoPendingTasks();

        });

        it('should return authentication data-mock-object', (done) => {

            const expectedAuthentication = jasmine.objectContaining({
                id: jasmine.any(String),
                authorization: jasmine.objectContaining({
                    type: Authorization.Basic,
                    key: jasmine.any(String),
                }),
                ident: jasmine.objectContaining({
                    id: jasmine.any(String),
                    name: testUserNameClaim,
                    firstName: jasmine.any(String),
                    lastName: jasmine.any(String),
                    birthdate: jasmine.any(Date),
                }),
                permissions: jasmine.objectContaining({
                    greet: [Permissions.Read],
                }),
            });

            authenticationService
                .authenticate(testUserNameClaim, testUserPasswordProof)
                .then((authentication) => {

                    expect(authentication)
                        .toEqual(expectedAuthentication);

                    done();

                })
                .catch(e => done(e));

            // flush timeout(s) for all code under test.
            $timeout.flush();
            $timeout.verifyNoPendingTasks();

        });

    });

});