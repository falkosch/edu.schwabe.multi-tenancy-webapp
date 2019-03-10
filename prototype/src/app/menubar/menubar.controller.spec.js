import _ from 'lodash';
import angular from 'angular';

import { MenubarModule } from './menubar.module';
import { MenubarName } from './menubar.component';
import { MenubarController } from './menubar.controller';
import { UserStateServiceName } from '../../core/user-state/user-state.service';
import { GlobalSpinnerServiceName } from '../../ui/global-spinner/global-spinner.service';
import { ProfileServiceName } from '../../core/backend/profile.service';
import { Authentication } from '../../core/backend/models/authentication.model';
import { AnonymousAuthorization } from '../../core/backend/models/anonymous-authorization.model';
import { Ident } from '../../core/backend/models/ident.model';
import { PermissionsWithDefault } from '../../core/backend/models/permissions-with-default.model';
import { AnonymousProfile } from '../../core/mock-backend/models/anonymous-profile.model';

describe(`${MenubarModule}.${MenubarName} controller`, () => {

    const testAnonymousId = 'ANONYMOUS';
    const testAnonymousAuthentication = new Authentication()
        .setAuthorization(new AnonymousAuthorization())
        .setIdent(new Ident().setId(testAnonymousId))
        .setPermissions(new PermissionsWithDefault().setDefault(testAnonymousId));

    const testId = 'TEST';
    const testProfile = {
        ...new AnonymousProfile(testId),
        name: {
            first: 'test',
        },
    };
    const testAuthentication = new Authentication()
        .setAuthorization(new AnonymousAuthorization())
        .setIdent(new Ident().setId(testId))
        .setPermissions(new PermissionsWithDefault().setDefault(testId));

    let testUnit;

    let $stateMockWithName;
    let $stateMockWithNameAndTitle;
    let allMocks;
    let globalSpinnerServiceMock;
    let profileServiceMock;
    let userStateServiceMock;
    let onLoginDisposalMock;
    let onLogoutDisposalMock;
    let eventMock;

    let $componentController;
    let $injector;
    let $rootScope;
    let $q;

    beforeEach(() => {

        $stateMockWithName = {
            current: {
                name: 'mockedName',
            },
        };

        $stateMockWithNameAndTitle = {
            current: {
                ...$stateMockWithName.current,
                data: {
                    title: 'mockedTitle',
                },
            },
        };

        eventMock = {};

        globalSpinnerServiceMock = {
            spinWhilePromise: jasmine.createSpy()
                .and
                .callFake(v => v),
        };

        profileServiceMock = {
            getProfile: jasmine.createSpy('getProfile'),
        };

        onLoginDisposalMock = {
            dispose: jasmine.createSpy('dispose'),
        };

        onLogoutDisposalMock = {
            dispose: jasmine.createSpy('dispose'),
        };

        userStateServiceMock = {
            authentication: testAnonymousAuthentication,
            isLoggedIn: false,
            logout: jasmine.createSpy(),
            onLogin: {
                subscribe: jasmine.createSpy('subscribe')
                    .and
                    .returnValue(onLoginDisposalMock),
            },
            onLogout: {
                subscribe: jasmine.createSpy('subscribe')
                    .and
                    .returnValue(onLogoutDisposalMock),
            },
        };

        allMocks = {
            $state: $stateMockWithName,
            [GlobalSpinnerServiceName]: globalSpinnerServiceMock,
            [ProfileServiceName]: profileServiceMock,
            [UserStateServiceName]: userStateServiceMock,
        };

        angular.mock.module(MenubarModule);

        inject((_$componentController_, _$injector_, _$rootScope_, _$q_) => {
            $componentController = _$componentController_;
            $injector = _$injector_;
            $rootScope = _$rootScope_;
            $q = _$q_;

            testUnit = $componentController(MenubarName, allMocks);
        });

    });

    describe('given architecture', () => {

        const expectedInjects = [
            '$state',
            UserStateServiceName,
            ProfileServiceName,
            GlobalSpinnerServiceName,
        ];

        it(`should only depend on ${expectedInjects.join(',')}`, () => {
            expect(_.sortBy($injector.annotate(MenubarController)))
                .toEqual(_.sortBy(expectedInjects));
        });

        it(`should be an instanceof ${MenubarController.name}`, () => {
            expect(testUnit)
                .toEqual(jasmine.any(MenubarController));
        });

    });

    describe('.currentStateTitle', () => {

        it('should return a string', () => {

            expect(testUnit.currentStateTitle)
                .toEqual(jasmine.any(String));

        });

        describe('when current state has "data.title" set', () => {

            beforeEach(() => {

                testUnit = $componentController(MenubarName, {
                    ...allMocks,
                    $state: $stateMockWithNameAndTitle,
                });

            });

            it('should return that state title', () => {

                expect(testUnit.currentStateTitle)
                    .toEqual($stateMockWithNameAndTitle.current.data.title);

                expect(testUnit.currentStateTitle)
                    .not
                    .toEqual($stateMockWithNameAndTitle.current.name);

            });

        });

        describe('when current state has NOT "data.title" set', () => {

            beforeEach(() => {

                testUnit = $componentController(MenubarName, {
                    ...allMocks,
                    $state: $stateMockWithName,
                });

            });

            it('should return the state name', () => {

                expect(testUnit.currentStateTitle)
                    .toEqual($stateMockWithName.current.name);

                expect(testUnit.currentStateTitle)
                    .not
                    .toEqual($stateMockWithNameAndTitle.current.data.title);

            });

        });

    });

    describe('.profileName', () => {

        beforeEach(() => {

            userStateServiceMock.isLoggedIn = true;

        });

        it('should return an object', () => {
            expect(testUnit.profileName)
                .toEqual(jasmine.any(Object));
        });

        describe('when profile binding has a name set', () => {

            beforeEach(() => {

                profileServiceMock.getProfile
                    .and
                    .returnValue($q.resolve(testProfile));

                testUnit.$onInit();
                $rootScope.$digest();

            });

            it('should return the name part of the profile', () => {
                expect(testUnit.profileName)
                    .toBe(testProfile.name);
            });

        });

        describe('when profile binding has NOT a name set', () => {

            beforeEach(() => {

                profileServiceMock.getProfile
                    .and
                    .returnValue($q.resolve(undefined));

                testUnit.$onInit();
                $rootScope.$digest();

            });

            it('should return an empty object instead', () => {
                expect(testUnit.profileName)
                    .toEqual({});
            });

        });

    });

    describe('.$onInit()', () => {

        it(`should subscribe to ${UserStateServiceName}.onLogin`, () => {

            testUnit.$onInit();

            expect(userStateServiceMock.onLogin.subscribe)
                .toHaveBeenCalledWith(jasmine.any(Function));

        });

        it(`should subscribe to ${UserStateServiceName}.onLogout`, () => {

            testUnit.$onInit();

            expect(userStateServiceMock.onLogout.subscribe)
                .toHaveBeenCalledWith(jasmine.any(Function));

        });

        describe('when user is NOT logged in', () => {

            beforeEach(() => {
                userStateServiceMock.isLoggedIn = false;
            });

            it('should NOT get a profile of any user', () => {

                testUnit.$onInit();

                expect(profileServiceMock.getProfile)
                    .toHaveBeenCalledTimes(0);

            });

        });

        describe('when user is logged in', () => {

            beforeEach(() => {

                userStateServiceMock.isLoggedIn = true;
                userStateServiceMock.authentication = testAuthentication;

                profileServiceMock.getProfile
                    .and
                    .returnValue($q.resolve(testProfile));

            });

            it('should get the profile and authentication of the user', () => {

                testUnit.$onInit();

                $rootScope.$digest();

                expect(testUnit.profile)
                    .toBe(testProfile);

                expect(testUnit.authentication)
                    .toBe(testAuthentication);

                expect(profileServiceMock.getProfile)
                    .toHaveBeenCalledWith(userStateServiceMock.authentication.id);

            });

        });

    });

    describe('.$onDestroy()', () => {

        describe('when it is NOT subscribed to login and logout events', () => {

            it('should NOT dispose any subscription and NOT throw', () => {

                expect(() => testUnit.$onDestroy())
                    .not
                    .toThrow();

                expect(onLoginDisposalMock.dispose)
                    .toHaveBeenCalledTimes(0);

                expect(onLogoutDisposalMock.dispose)
                    .toHaveBeenCalledTimes(0);

            });

        });

        describe('when it is subscribed to login and logout events', () => {

            beforeEach(() => {
                testUnit.$onInit();
            });

            it('should dispose the onLogin and onLogout subscription', () => {

                testUnit.$onDestroy();

                expect(onLoginDisposalMock.dispose)
                    .toHaveBeenCalledTimes(1);

                expect(onLogoutDisposalMock.dispose)
                    .toHaveBeenCalledTimes(1);

            });

        });

    });

    describe('.logout()', () => {

        beforeEach(() => {

            userStateServiceMock.logout
                .and
                .returnValue($q.resolve());

        });

        it(`should return promise of call ${UserStateServiceName}.logout()`, (done) => {

            testUnit.logout()
                .then(() => {

                    expect(userStateServiceMock.logout)
                        .toHaveBeenCalledTimes(1);

                    done();
                })
                .catch((e) => {
                    done.fail(e);
                });

            $rootScope.$digest();

        });

    });

    describe('onLogin and onLogout subscriptions', () => {

        let loginSubscriber;
        let logoutSubscriber;

        beforeEach(() => {

            userStateServiceMock.onLogin.subscribe
                .and
                .callFake((subscriber) => { loginSubscriber = subscriber; });

            userStateServiceMock.onLogout.subscribe
                .and
                .callFake((subscriber) => { logoutSubscriber = subscriber; });

        });

        it('should noop on initialization', () => {

            testUnit.$onInit();

            expect(testUnit.authentication)
                .toBeUndefined();

            expect(testUnit.profile)
                .toBeUndefined();

            expect(profileServiceMock.getProfile)
                .toHaveBeenCalledTimes(0);

        });

        describe('when the user gets logged in', () => {

            beforeEach(() => {

                testUnit.$onInit();

                userStateServiceMock.isLoggedIn = true;
                userStateServiceMock.authentication = testAuthentication;

                profileServiceMock.getProfile
                    .and
                    .returnValue($q.resolve(testProfile));

            });

            it('should apply authentication and profile', (done) => {

                loginSubscriber(eventMock, testAuthentication)
                    .then(() => {

                        expect(testUnit.authentication)
                            .toBe(testAuthentication);

                        expect(testUnit.profile)
                            .toBe(testProfile);

                        expect(profileServiceMock.getProfile)
                            .toHaveBeenCalledWith(testId);

                        done();
                    })
                    .catch((e) => {
                        done.fail(e);
                    });

                $rootScope.$digest();

            });

        });

        describe('when the user gets logged out', () => {

            beforeEach(() => {

                testUnit.$onInit();

            });

            it('should unset authentication and profile', () => {

                logoutSubscriber();

                expect(testUnit.authentication)
                    .toBeUndefined();

                expect(testUnit.profile)
                    .toBeUndefined();

            });

        });

    });

});
