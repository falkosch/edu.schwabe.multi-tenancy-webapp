import _ from 'lodash';
import angular from 'angular';

import { RequiresLoginStateAccessGuardModule } from './requires-login-state-access-guard.module';
import { RequiresLoginStateAccessGuardServiceName, RequiresLoginStateAccessGuardService } from './requires-login-state-access-guard.service';
import { UserStateServiceName } from '../../user-state/user-state.service';

describe(`${RequiresLoginStateAccessGuardModule}.${RequiresLoginStateAccessGuardServiceName}`, () => {

    let testUnit;

    let userStateServiceMock;

    let $injector;
    let $rootScope;

    beforeEach(() => {

        userStateServiceMock = {
            isLoggedIn: false,
        };

        angular.mock.module(RequiresLoginStateAccessGuardModule, {
            [UserStateServiceName]: userStateServiceMock,
        });

        inject((_$injector_, _$rootScope_) => {
            $injector = _$injector_;
            $rootScope = _$rootScope_;

            testUnit = $injector.get(RequiresLoginStateAccessGuardServiceName);
        });

    });

    describe('given architecture', () => {

        const expectedInjects = [
            '$q',
            UserStateServiceName,
        ];

        it(`should only depend on ${expectedInjects.join(',')}`, () => {
            expect(_.sortBy($injector.annotate(RequiresLoginStateAccessGuardService)))
                .toEqual(_.sortBy(expectedInjects));
        });

        it(`should be an instanceof ${RequiresLoginStateAccessGuardService.name}`, () => {
            expect(testUnit)
                .toEqual(jasmine.any(RequiresLoginStateAccessGuardService));
        });

    });

    describe('authorizeAccessToState', () => {

        function testAuthorization(done, requiresLogin, expectedAuthorized) {
            testUnit.authorize(requiresLogin)
                .then((authorized) => {

                    expect(authorized)
                        .toBe(expectedAuthorized);

                    done();
                })
                .catch((e) => {
                    done.fail(e);
                });

            $rootScope.$digest();
        }

        describe('when login is required for state', () => {

            describe('when user is logged in', () => {

                beforeEach(() => {
                    userStateServiceMock.isLoggedIn = true;
                });

                it('should return a promise that access is authorized', (done) => {
                    testAuthorization(done, true, true);
                });

            });

            describe('when user is NOT logged in', () => {

                beforeEach(() => {
                    userStateServiceMock.isLoggedIn = false;
                });

                it('should return a promise that access is NOT authorized', (done) => {
                    testAuthorization(done, true, false);
                });

            });

        });

        describe('when login is NOT required for state', () => {

            it('should return a promise with that access is authorized', (done) => {
                testAuthorization(done, false, true);
            });

        });

    });

});
