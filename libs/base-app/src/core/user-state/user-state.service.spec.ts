import _ from 'lodash';
import angular from 'angular';

import { UserStateModule } from './user-state.module';

import {
    UserStateServiceName,
    UserStateService,
    ERROR_ALREADY_LOGGED_IN,
    UserStateEvents,
    ERROR_ALREADY_LOGGED_OUT,
} from './user-state.service';
import { InjectionServiceName } from '../annotations/injection.service';
import { EventEmitterServiceName, EventEmitterService } from '../event-emitter/event-emitter.service';
import { AuthenticationServiceName, AuthenticationService } from '../backend/authentication.service';
import { Authentication } from '../backend/models/authentication.model';
import { AnonymousAuthorization } from '../backend/models/anonymous-authorization.model';
import { EventConsumer, EventEmitter } from '../event-emitter/event-emitter.model';
import { Ident } from '../backend/models/ident.model';

describe(`${UserStateModule}.${UserStateServiceName}`, () => {

    const testAnonymousAuthentication = new Authentication(new Ident('0'))
        .setAuthorization(new AnonymousAuthorization());
    const testAuthentication = new Authentication(new Ident('1'));
    const testUserName = 'test';
    const testUserPassword = 'TEST';
    const testError = 'Test fail';

    let testUnit: UserStateService;

    let authenticationServiceMock: jasmine.SpyObj<AuthenticationService>;
    let eventEmitterSubscribers: Record<UserStateEvents, EventConsumer<any>>;
    let eventEmitterMocks: Record<UserStateEvents, jasmine.SpyObj<EventEmitter<any>>>;
    let eventEmitterServiceMock: EventEmitterService;

    let $injector: angular.auto.IInjectorService;
    let $q: angular.IQService;
    let $rootScope: angular.IRootScopeService;

    function testIsLoggedIn(): void {
        expect(testUnit.isLoggedIn)
            .toBe(true);

        expect(testUnit.authentication)
            .toBe(testAuthentication);
    }

    function testIsNotLoggedIn(): void {
        expect(testUnit.isLoggedIn)
            .toBe(false);

        expect(testUnit.authentication)
            .toBe(testAnonymousAuthentication);
    }

    beforeEach(() => {

        authenticationServiceMock = {
            anonymous: jasmine.createSpy('anonymous').and.returnValue(testAnonymousAuthentication),
            authenticate: jasmine.createSpy('authenticate'),
        } as any;

        eventEmitterSubscribers = {
            [UserStateEvents.Login]: jasmine.createSpy().and.throwError('test failure'),
            [UserStateEvents.Logout]: jasmine.createSpy().and.throwError('test failure'),
        };

        eventEmitterMocks = {
            [UserStateEvents.Login]: {
                subscribe: jasmine.createSpy('subscribe')
                    .and.callFake((consumer: EventConsumer<Authentication>) => {
                        eventEmitterSubscribers[UserStateEvents.Login] = consumer;
                        return eventEmitterMocks[UserStateEvents.Login];
                    }),
                emit: jasmine.createSpy('emit'),
            } as any,
            [UserStateEvents.Logout]: {
                subscribe: jasmine.createSpy('subscribe')
                    .and.callFake((consumer: EventConsumer<void>) => {
                        eventEmitterSubscribers[UserStateEvents.Logout] = consumer;
                        return eventEmitterMocks[UserStateEvents.Logout];
                    }),
                emit: jasmine.createSpy('emit'),
            } as any,
        };

        eventEmitterServiceMock = {
            of: jasmine.createSpy()
                .withArgs(UserStateEvents.Login)
                .and.returnValue(eventEmitterMocks[UserStateEvents.Login])
                .withArgs(UserStateEvents.Logout)
                .and.returnValue(eventEmitterMocks[UserStateEvents.Logout]),
        } as any;

        angular.mock.module(UserStateModule, {
            [AuthenticationServiceName]: authenticationServiceMock,
            [EventEmitterServiceName]: eventEmitterServiceMock,
        });

        inject((_$injector_, _$q_, _$rootScope_) => {
            $injector = _$injector_;
            $q = _$q_;
            $rootScope = _$rootScope_;

            testUnit = $injector.get(UserStateServiceName);
        });

    });

    describe('given architecture', () => {

        const expectedInjects = [
            InjectionServiceName,
            EventEmitterServiceName,
            AuthenticationServiceName,
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
                .toBe(eventEmitterMocks[UserStateEvents.Login]);
        });

    });

    describe('.onLogout', () => {

        it(`should be an event emitter created by ${EventEmitterServiceName}`, () => {
            expect(testUnit.onLogout)
                .toBe(eventEmitterMocks[UserStateEvents.Logout]);
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
                        .and.returnValue($q.reject(new Error(testError)));
                });

                it('should fail login', (done) => {
                    testUnit.login(testUserName, testUserPassword)
                        .then(() => done.fail('test failure'))
                        .catch((error: Error) => {
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
                            expect(eventEmitterMocks[UserStateEvents.Login].emit)
                                .toHaveBeenCalledTimes(0);

                            done();
                        });

                    $rootScope.$digest();
                });

            });

            describe('when authentication succeeds', () => {

                beforeEach(() => {
                    authenticationServiceMock.authenticate
                        .and.returnValue($q.resolve(testAuthentication));
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
                            expect(eventEmitterMocks[UserStateEvents.Login].emit)
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
                    .and.returnValue($q.resolve(testAuthentication));

                testUnit.login(testUserName, testUserPassword)
                    .then(() => {
                        authenticationServiceMock.authenticate.calls.reset();
                        eventEmitterMocks[UserStateEvents.Login].emit.calls.reset();

                        authenticationServiceMock.authenticate
                            .and.callFake(
                                // this one here must be a callFake instead of a returnValue
                                () => $q.reject(new Error('test failure')),
                            );

                        done();
                    })
                    .catch((error) => done.fail(error));

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
                        expect(eventEmitterMocks[UserStateEvents.Login].emit)
                            .toHaveBeenCalledTimes(0);

                        done();
                    });

                $rootScope.$digest();
            });

        });

    });

    describe('.logout()', () => {

        describe('when user is NOT logged in', () => {

            it('should fail logout try', (done) => {
                testUnit.logout()
                    .then(() => done.fail('test failure'))
                    .catch((error: Error) => {
                        expect(error.message)
                            .toEqual(ERROR_ALREADY_LOGGED_OUT);

                        done();
                    });

                $rootScope.$digest();
            });

            it('should not change the logged in state', (done) => {
                testUnit.logout()
                    .then(() => done.fail('test failure'))
                    .catch(() => {
                        testIsNotLoggedIn();

                        done();
                    });

                $rootScope.$digest();
            });

            it('should not emit an onLogin event', (done) => {
                testUnit.logout()
                    .then(() => done.fail('test failure'))
                    .catch(() => {
                        expect(eventEmitterMocks[UserStateEvents.Logout].emit)
                            .toHaveBeenCalledTimes(0);

                        done();
                    });

                $rootScope.$digest();
            });

        });

        describe('when user is logged in', () => {

            beforeEach((done) => {
                authenticationServiceMock.authenticate
                    .and.returnValue($q.resolve(testAuthentication));

                testUnit.login(testUserName, testUserPassword)
                    .then(() => done())
                    .catch((error) => done.fail(error));

                $rootScope.$digest();
            });

            it('should resolve and change logged out state', (done) => {
                testUnit.logout()
                    .then(() => {
                        testIsNotLoggedIn();

                        done();
                    })
                    .catch((error) => done.fail(error));

                $rootScope.$digest();
            });

            it('should emit an onLogout event', (done) => {
                testUnit.logout()
                    .then(() => {
                        expect(eventEmitterMocks[UserStateEvents.Logout].emit)
                            .toHaveBeenCalledTimes(1);

                        done();
                    })
                    .catch((error) => done.fail(error));

                $rootScope.$digest();
            });

        });

    });

});
