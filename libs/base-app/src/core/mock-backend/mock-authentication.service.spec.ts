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
import { ProfileServiceName, ProfileService } from '../backend/profile.service';

describe(`${MockBackendModule}.${MockAuthenticationServiceName} implementing ${BackendModule}.${AuthenticationServiceName}`, () => {

    const testUserNameClaim = 'test';
    const testUserPasswordProof = 'password';

    let testUnit: MockAuthenticationService;

    let profileServiceMock: jasmine.SpyObj<ProfileService>;

    let $injector: angular.auto.IInjectorService;
    let $q: angular.IQService;
    let $rootScope: angular.IRootScopeService;
    let $timeout: angular.ITimeoutService;

    beforeEach(() => {

        profileServiceMock = {
            loadProfiles: jasmine.createSpy(),
        } as any;

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

        function testMissingUserPasswordProofError(e: Error): void {
            expect(e.message)
                .toEqual(BackendErrors.missingUserPasswordProof().message);
        }

        afterEach(() => {
            $timeout.verifyNoPendingTasks();
        });

        describe('when empty user password proof is given', () => {

            it('should reject authentication', (done) => {

                testUnit.authenticate(testUserNameClaim, '')
                    .then(() => done.fail())
                    .catch((e) => {
                        testMissingUserPasswordProofError(e);
                        done();
                    });

                $timeout.flush();
            });

        });

        describe('when a valid password is given', () => {

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
                    tokens: jasmine.objectContaining({
                        greet: [Permissions.Read],
                    }),
                }),
            });

            beforeEach(() => {
                profileServiceMock.loadProfiles
                    .and.returnValue($q.resolve([]));
            });

            it('should return authentication data-mock-object', (done) => {
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
                            .toEqual(expectedAuthentication as any);

                        done();
                    })
                    .catch((e) => done.fail(e));

                $rootScope.$digest();
                $timeout.flush();
            });

        });


    });

});
