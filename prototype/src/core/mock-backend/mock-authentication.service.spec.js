import _ from 'lodash';
import angular from 'angular';

import { MockAuthenticationServiceName, MockAuthenticationService } from './mock-authentication.service';
import { MockBackendModule } from './mock-backend.module';
import { BackendModule } from '../backend/backend.module';
import { AuthenticationServiceName } from '../backend/authentication.service';
import { BackendErrors } from '../backend/backend-errors';
import { Authentication } from '../backend/models/authentication.model';
import { Authorization } from '../backend/models/authorization.model';
import { Ident } from '../backend/models/ident.model';
import { Permissions } from '../backend/models/permissions.model';
import { ProfileServiceName } from '../backend/profile.service';

describe(`${MockBackendModule}.${MockAuthenticationServiceName} implementing ${BackendModule}.${AuthenticationServiceName}`, () => {

    const testUserNameClaim = 'test';
    const testUserPasswordProof = 'password';

    let testUnit;

    let profileServiceMock;

    let $injector;
    let $q;
    let $rootScope;
    let $timeout;

    beforeEach(() => {

        profileServiceMock = {
            profiles: [],
        };

        angular.mock.module(MockBackendModule, {
            [ProfileServiceName]: profileServiceMock,
        });

        inject((_$injector_, _$q_, _$rootScope_, _$timeout_) => {
            $injector = _$injector_;
            $q = _$q_;
            $rootScope = _$rootScope_;
            $timeout = _$timeout_;

            testUnit = $injector.get(AuthenticationServiceName);
        });

    });

    afterEach(() => {
        $timeout.verifyNoPendingTasks();
    });

    describe('given architecture', () => {

        const expectedInjects = [
            '$timeout',
            '$q',
            ProfileServiceName,
        ];

        it(`should only depend on ${expectedInjects.join(',')}`, () => {
            expect(_.sortBy($injector.annotate(MockAuthenticationService)))
                .toEqual(_.sortBy(expectedInjects));
        });

        it(`should be an instanceof ${MockAuthenticationService.name}`, () => {
            expect(testUnit)
                .toEqual(jasmine.any(MockAuthenticationService));
        });

    });

    describe('.authenticate()', () => {

        it('should reject on missing, undefined, null or empty userPasswordProof', (done) => {

            function checkError(e) {
                expect(e)
                    .toEqual(jasmine.any(Error));

                expect(e.message)
                    .toEqual(BackendErrors.missingUserPasswordProof().message);
            }

            testUnit.authenticate(testUserNameClaim)
                .catch(e => checkError(e))
                .then(() => _.reduce(
                    [undefined, null, ''],
                    (acc, password) => acc
                        .then(() => testUnit.authenticate(testUserNameClaim, password))
                        .catch(e => checkError(e)),
                    $q.resolve(),
                ))
                .then(() => done())
                .catch(e => done.fail(e));

            $timeout.flush();
        });

        it('should return authentication data-mock-object', (done) => {

            const expectedAuthentication = jasmine.objectContaining({
                authorization: jasmine.objectContaining({
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

            testUnit.authenticate(testUserNameClaim, testUserPasswordProof)
                .then((authentication) => {

                    expect(authentication)
                        .toEqual(jasmine.any(Authentication));

                    expect(authentication.authorization)
                        .toEqual(jasmine.any(Authorization));

                    expect(authentication.ident)
                        .toEqual(jasmine.any(Ident));

                    expect(authentication.permissions)
                        .toEqual(jasmine.any(Permissions));

                    expect(authentication)
                        .toEqual(expectedAuthentication);

                    done();

                })
                .catch(e => done.fail(e));

            $rootScope.$digest();
            $timeout.flush();
        });

    });

});
