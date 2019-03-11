import _ from 'lodash';
import angular from 'angular';

import { UserStateModule } from './user-state.module';

import {
    UserStateServiceName,
    UserStateService,
    UserStateEventLogout,
    UserStateEventLogin,
    ERROR_ALREADY_LOGGED_IN,
} from './user-state.service';
import { InjectionServiceName } from '../annotations/injection.service';
import { EventEmitterServiceName } from '../event-emitter/event-emitter.service';
import { AuthenticationServiceName } from '../backend/authentication.service';
import { Authentication } from '../backend/models/authentication.model';
import { AnonymousAuthorization } from '../backend/models/anonymous-authorization.model';

describe(`${UserStateModule}.${UserStateServiceName}`, () => {

    const testAnonymousAuthentication = new Authentication()
        .setAuthorization(new AnonymousAuthorization());
    const testAuthentication = new Authentication();
    const testUserName = 'test';
    const testUserPassword = 'TEST';
    const testError = 'Test fail';

    function testIsLoggedIn() {
        expect(testUnit.isLoggedIn)
            .toBe(true);

        expect(testUnit.authentication)
            .toBe(testAuthentication);
    }

    function testIsNotLoggedIn() {
        expect(testUnit.isLoggedIn)
            .toBe(false);

        expect(testUnit.authentication)
            .toBe(testAnonymousAuthentication);
    }

    let testUnit;

    let authenticationServiceMock;
    let eventEmitterMocks;
    let eventEmitterServiceMock;
    let injectionServiceMock;

    let $injector;
    let $q;
    let $rootScope;

    beforeEach(() => {

        authenticationServiceMock = {
            anonymous: testAnonymousAuthentication,
            authenticate: jasmine.createSpy('authenticate'),
        };

        eventEmitterMocks = {
            [UserStateEventLogin]: {
                subscribe: jasmine.createSpy()
                    .and
                    .callFake((subscriber) => {
                        const eventEmitter = eventEmitterMocks[UserStateEventLogin];
                        eventEmitter.subscriber = subscriber;
                        return eventEmitter;
                    }),
                emit: jasmine.createSpy(),
            },
            [UserStateEventLogout]: {
                subscribe: jasmine.createSpy()
                    .and
                    .callFake((subscriber) => {
                        const eventEmitter = eventEmitterMocks[UserStateEventLogout];
                        eventEmitter.subscriber = subscriber;
                        return eventEmitter;
                    }),
                emit: jasmine.createSpy(),
            },
        };

        eventEmitterServiceMock = {
            of: jasmine.createSpy(),
        };
        eventEmitterServiceMock.of.withArgs(UserStateEventLogin)
            .and
            .returnValue(eventEmitterMocks[UserStateEventLogin]);
        eventEmitterServiceMock.of.withArgs(UserStateEventLogout)
            .and
            .returnValue(eventEmitterMocks[UserStateEventLogout]);

        angular.mock.module(UserStateModule, {
            [AuthenticationServiceName]: authenticationServiceMock,
            [EventEmitterServiceName]: eventEmitterServiceMock,
        });

        inject((_$injector_, _$q_, _$rootScope_) => {
            $injector = _$injector_;
            $q = _$q_;
            $rootScope = _$rootScope_;

            injectionServiceMock = $injector.get(InjectionServiceName);
            spyOn(injectionServiceMock, 'injectByStaticInjectionNames').and.callThrough();

            testUnit = $injector.get(UserStateServiceName);
        });

    });

    describe('given architecture', () => {

        const expectedInjects = [
            '$rootScope',
            EventEmitterServiceName,
            InjectionServiceName,
        ];

        it(`should only depend on ${expectedInjects.join(',')}`, () => {
            expect(_.sortBy($injector.annotate(UserStateService)))
                .toEqual(_.sortBy(expectedInjects));
        });

        it(`should be an instanceof ${UserStateService.name}`, () => {
            expect(testUnit)
                .toEqual(jasmine.any(UserStateService));
        });

    });

    describe('.onLogin', () => {

        it(`should be an event emitter created by ${EventEmitterServiceName}`, () => {
            expect(testUnit.onLogin)
                .toBe(eventEmitterMocks[UserStateEventLogin]);
        });

    });

    describe('.onLogout', () => {

        it(`should be an event emitter created by ${EventEmitterServiceName}`, () => {
            expect(testUnit.onLogout)
                .toBe(eventEmitterMocks[UserStateEventLogout]);
        });

    });

    describe('.isLoggedIn', () => {

        it('should return that the user is NOT logged in on intialization', () => {
            expect(testUnit.isLoggedIn)
                .toBe(false);
        });

    });

    describe('.authentication', () => {

        it('should return the user\'s anonymous authentication data on intialization', () => {
            expect(testUnit.authentication)
                .toBe(testAnonymousAuthentication);
        });

    });

    describe('.login(userNameClaim, userPasswordProof)', () => {

        describe('when user is NOT logged in', () => {

            describe('when authentication fails', () => {

                beforeEach(() => {
                    authenticationServiceMock.authenticate
                        .and
                        .returnValue($q.reject(new Error(testError)));
                });

                it('should fail login', (done) => {
                    testUnit.login(testUserName, testUserPassword)
                        .then(() => done.fail('test failure'))
                        .catch((error) => {
                            expect(error)
                                .toEqual(jasmine.any(Error));

                            expect(error.message)
                                .toEqual(testError);

                            expect(authenticationServiceMock.authenticate)
                                .toHaveBeenCalledWith(testUserName, testUserPassword);

                            done();
                        });

                    $rootScope.$digest();
                });

                it('should NOT change the logged in state', (done) => {
                    testUnit.login(testUserName, testUserPassword)
                        .then(() => done.fail('test failure'))
                        .catch(() => {
                            testIsNotLoggedIn();

                            done();
                        });

                    $rootScope.$digest();
                });

                it('should not emit an onLogin event', (done) => {
                    testUnit.login(testUserName, testUserPassword)
                        .then(() => done.fail('test failure'))
                        .catch(() => {
                            expect(eventEmitterMocks[UserStateEventLogin].emit)
                                .toHaveBeenCalledTimes(0);

                            done();
                        });

                    $rootScope.$digest();
                });

            });

            describe('when authentication succeeds', () => {

                beforeEach(() => {
                    authenticationServiceMock.authenticate
                        .and
                        .returnValue($q.resolve(testAuthentication));
                });

                it('should have authenticated the user against the backend', (done) => {
                    testUnit.login(testUserName, testUserPassword)
                        .then(() => {
                            expect(authenticationServiceMock.authenticate)
                                .toHaveBeenCalledWith(testUserName, testUserPassword);

                            done();
                        })
                        .catch(() => done.fail());

                    $rootScope.$digest();
                });

                it('should change the logged in state', (done) => {
                    testUnit.login(testUserName, testUserPassword)
                        .then(() => {
                            testIsLoggedIn();

                            done();
                        })
                        .catch(() => done.fail());

                    $rootScope.$digest();
                });

                it('should emit an onLogin event', (done) => {
                    testUnit.login(testUserName, testUserPassword)
                        .then(() => {
                            expect(eventEmitterMocks[UserStateEventLogin].emit)
                                .toHaveBeenCalledWith(testAuthentication);

                            done();
                        })
                        .catch(() => done.fail());


                    $rootScope.$digest();
                });

            });

        });

        describe('when user is already logged in', () => {

            beforeEach((done) => {
                authenticationServiceMock.authenticate
                    .and
                    .returnValue($q.resolve(testAuthentication));

                testUnit.login(testUserName, testUserPassword)
                    .then(() => {
                        authenticationServiceMock.authenticate.calls.reset();
                        eventEmitterMocks[UserStateEventLogin].emit.calls.reset();

                        authenticationServiceMock.authenticate
                            .and
                            .callFake( // this one here must be a callFake instead of a returnValue
                                () => $q.reject(new Error('test failure')),
                            );

                        done();
                    })
                    .catch(error => done.fail(error));

                $rootScope.$digest();
            });

            it('should reflect that logged in state', () => {
                testIsLoggedIn();
            });

            it('should fail second login try', (done) => {
                testUnit.login(testUserName, testUserPassword)
                    .then(() => done.fail('test failure'))
                    .catch((error) => {
                        expect(error)
                            .toEqual(jasmine.any(Error));

                        expect(error.message)
                            .toEqual(ERROR_ALREADY_LOGGED_IN);

                        done();
                    });

                $rootScope.$digest();
            });

            it('should fail early without making the authentication request', (done) => {
                testUnit.login(testUserName, testUserPassword)
                    .then(() => done.fail('test failure'))
                    .catch(() => {
                        expect(authenticationServiceMock.authenticate)
                            .toHaveBeenCalledTimes(0);

                        done();
                    });

                $rootScope.$digest();
            });

            it('should not change the logged in state', (done) => {
                testUnit.login(testUserName, testUserPassword)
                    .then(() => done.fail('test failure'))
                    .catch(() => {
                        testIsLoggedIn();

                        done();
                    });

                $rootScope.$digest();
            });

            it('should not emit an onLogin event', (done) => {
                testUnit.login(testUserName, testUserPassword)
                    .then(() => done.fail('test failure'))
                    .catch(() => {
                        expect(eventEmitterMocks[UserStateEventLogin].emit)
                            .toHaveBeenCalledTimes(0);

                        done();
                    });

                $rootScope.$digest();
            });

        });

    });

    describe('.logout()', () => {

        describe('when user is NOT logged in', () => {

            it('should silently resolve and not change logged out state', (done) => {
                testUnit.logout()
                    .then(() => {
                        testIsNotLoggedIn();

                        done();
                    })
                    .catch(error => done.fail(error));

                $rootScope.$digest();
            });

            it('should emit an onLogout event', (done) => {
                testUnit.logout()
                    .then(() => {
                        expect(eventEmitterMocks[UserStateEventLogout].emit)
                            .toHaveBeenCalledTimes(1);

                        done();
                    })
                    .catch(error => done.fail(error));

                $rootScope.$digest();
            });

        });

        describe('when user is logged in', () => {

            beforeEach((done) => {
                authenticationServiceMock.authenticate
                    .and
                    .returnValue($q.resolve(testAuthentication));

                testUnit.login(testUserName, testUserPassword)
                    .then(() => done())
                    .catch(error => done.fail(error));

                $rootScope.$digest();
            });

            it('should resolve and change logged out state', (done) => {
                testUnit.logout()
                    .then(() => {
                        testIsNotLoggedIn();

                        done();
                    })
                    .catch(error => done.fail(error));

                $rootScope.$digest();
            });

            it('should emit an onLogout event', (done) => {
                testUnit.logout()
                    .then(() => {
                        expect(eventEmitterMocks[UserStateEventLogout].emit)
                            .toHaveBeenCalledTimes(1);

                        done();
                    })
                    .catch(error => done.fail(error));

                $rootScope.$digest();
            });

        });

    });

});
