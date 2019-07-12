import _ from 'lodash';
import angular from 'angular';

import { HeaderModule } from './header.module';
import { HeaderComponentName } from './header.component';
import { HeaderController } from './header.controller';
import { UserStateServiceName } from '../../core/user-state/user-state.service';
import { ProfileServiceName } from '../../core/backend/profile.service';
import { GlobalSpinnerServiceName } from '../../ui/global-spinner/global-spinner.service';

describe(`${HeaderModule}.${HeaderComponentName} controller`, () => {

    const testProfile = {
        name: {},
    };

    let testUnit;

    const mockEvent = {};
    let userStateServiceMock;
    let profileServiceMock;
    let globalSpinnerServiceMock;

    let $injector;
    let $rootScope;
    let $q;

    beforeEach(() => {

        userStateServiceMock = {
            isLoggedIn: false,
            onLogin: {
                subscribe: jasmine.createSpy('subscribe'),
            },
            onLogout: {
                subscribe: jasmine.createSpy('subscribe'),
            },
            authentication: {
                id: 'test',
            },
        };

        globalSpinnerServiceMock = {
            spinWhilePromise: jasmine.createSpy('spinWhilePromise'),
        };

        profileServiceMock = {
            getProfile: jasmine.createSpy('getProfile')
                .and
                .callFake(() => $q.resolve(testProfile)),
        };

        angular.mock.module(HeaderModule);

        inject((_$injector_, _$rootScope_, _$q_, $componentController) => {
            $injector = _$injector_;
            $rootScope = _$rootScope_;
            $q = _$q_;

            testUnit = $componentController(
                HeaderComponentName,
                {
                    [UserStateServiceName]: userStateServiceMock,
                    [ProfileServiceName]: profileServiceMock,
                    [GlobalSpinnerServiceName]: globalSpinnerServiceMock,
                },
            );
        });

    });

    describe('given architecture', () => {

        const expectedInjects = [
            UserStateServiceName,
            ProfileServiceName,
            GlobalSpinnerServiceName,
        ];

        it(`should only depend on ${expectedInjects.join(',')}`, () => {
            expect(_.sortBy($injector.annotate(HeaderController)))
                .toEqual(_.sortBy(expectedInjects));
        });

        it(`should be an instanceof ${HeaderController.name}`, () => {
            expect(testUnit)
                .toEqual(jasmine.any(HeaderController));
        });

    });

    describe('when the component is initialized', () => {

        let loginDisposeMock;

        let logoutDisposeMock;

        beforeEach(() => {
            userStateServiceMock.onLogin.subscribe
                .and
                .callFake(() => loginDisposeMock);

            userStateServiceMock.onLogout.subscribe
                .and
                .callFake(() => logoutDisposeMock);
        });

        it('should subscribe the login events', () => {
            testUnit.$onInit();

            expect(userStateServiceMock.onLogin.subscribe)
                .toHaveBeenCalledWith(jasmine.any(Function));

            expect(userStateServiceMock.onLogout.subscribe)
                .toHaveBeenCalledWith(jasmine.any(Function));
        });

        describe('when the component is destroyed again', () => {

            beforeEach(() => {
                loginDisposeMock = {
                    dispose: jasmine.createSpy('dispose'),
                };

                logoutDisposeMock = {
                    dispose: jasmine.createSpy('dispose'),
                };
            });

            it('should dispose the login and logout subscriptions', () => {
                testUnit.$onInit();
                testUnit.$onDestroy();

                expect(loginDisposeMock.dispose)
                    .toHaveBeenCalledTimes(1);

                expect(logoutDisposeMock.dispose)
                    .toHaveBeenCalledTimes(1);

            });

        });

    });

    describe('when the component is destroyed before subscribing login and logout events', () => {

        it('should not throw', () => {
            expect(() => testUnit.$onDestroy())
                .not
                .toThrow();
        });

    });

    describe('when user is not logged in on intialization', () => {

        beforeEach(() => {
            userStateServiceMock.isLoggedIn = false;
        });

        it('should not set an initial authentication', () => {
            testUnit.$onInit();

            expect(testUnit.authentication)
                .not
                .toBe(userStateServiceMock.authentication);
        });

    });

    describe('when user is logged in on intialization', () => {

        beforeEach(() => {
            userStateServiceMock.isLoggedIn = true;
        });

        it('should set an initial authentication', () => {
            testUnit.$onInit();

            expect(testUnit.authentication)
                .toBe(userStateServiceMock.authentication);
        });

    });

    it('should set or unset authentication and profile on login or logout', () => {

        let logoutSubscriber;

        userStateServiceMock.onLogin.subscribe.and.callFake(
            subscriber => subscriber(mockEvent, userStateServiceMock.authentication),
        );
        userStateServiceMock.onLogout.subscribe.and.callFake(
            (subscriber) => {
                logoutSubscriber = subscriber;
            },
        );

        testUnit.$onInit();

        $rootScope.$digest();

        expect(testUnit.authentication)
            .toBe(userStateServiceMock.authentication);

        expect(testUnit.profile)
            .toBe(testProfile);

        logoutSubscriber();

        expect(testUnit.authentication)
            .not
            .toBe(userStateServiceMock.authentication);

        expect(testUnit.profile)
            .not
            .toBe(testProfile);

    });

    describe('.isLoggedIn', () => {

        it('should return the logged in status of the user', () => {

            function testLoggedInStatus(loggedIn) {

                userStateServiceMock.isLoggedIn = loggedIn;

                expect(testUnit.isLoggedIn)
                    .toEqual(loggedIn);

            }

            testLoggedInStatus(false);
            testLoggedInStatus(true);

        });

    });

    describe('.profileName', () => {

        describe('when user is not logged in and profile will not be set', () => {

            beforeEach(() => {
                userStateServiceMock.onLogin.subscribe
                    .and
                    .stub();
            });

            it('should return an empty stub for the user\'s profile name', () => {

                testUnit.$onInit();

                $rootScope.$digest();

                expect(profileServiceMock.getProfile)
                    .toHaveBeenCalledTimes(0);

                expect(testUnit.profile)
                    .toBeUndefined();

                expect(testUnit.profileName)
                    .toEqual({});

            });

        });

        describe('when user is logged in and profile will be set', () => {

            beforeEach(() => {
                userStateServiceMock.onLogin.subscribe
                    .and
                    .callFake(
                        subscriber => subscriber(mockEvent, userStateServiceMock.authentication),
                    );
            });

            it('should return the user\'s profile name', () => {

                testUnit.$onInit();

                $rootScope.$digest();

                expect(profileServiceMock.getProfile)
                    .toHaveBeenCalledWith(userStateServiceMock.authentication.id);

                expect(testUnit.profile)
                    .toBe(testProfile);

                expect(testUnit.profileName)
                    .toBe(testProfile.name);

            });

        });

    });

});
