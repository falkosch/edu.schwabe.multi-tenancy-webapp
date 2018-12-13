import { not } from '@uirouter/core';
import { HeaderModule } from './header.module';
import { HeaderName } from './header.component';
import { HeaderController } from './header.controller';
import { UserStateServiceName } from '../../core/user-state/user-state.service';
import { ProfileServiceName } from '../../core/backend/profile.service';
import { GlobalSpinnerServiceName } from '../../ui/global-spinner/global-spinner.service';

describe(`${HeaderModule}.${HeaderName} component controller`, () => {

    const testProfile = {
        name: {},
    };

    const mockEvent = {};

    let headerController;
    let userStateServiceMock;
    let profileServiceMock;
    let globalSpinnerServiceMock;

    let $rootScope;
    let $q;

    beforeEach(() => {

        angular.mock.module(HeaderModule);

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

        inject((_$rootScope_, _$q_, $componentController) => {

            $rootScope = _$rootScope_;
            $q = _$q_;

            headerController = $componentController(
                HeaderName,
                {
                    [UserStateServiceName]: userStateServiceMock,
                    [ProfileServiceName]: profileServiceMock,
                    [GlobalSpinnerServiceName]: globalSpinnerServiceMock,
                },
            );
        });

    });

    it(`should be an instanceof ${HeaderName} component controller`, () => {

        expect(headerController)
            .toEqual(jasmine.any(HeaderController));

    });

    it('should subscribe the login events', () => {

        const loginDisposeMock = {
            dispose: jasmine.createSpy('dispose'),
        };
        const logoutDisposeMock = {
            dispose: jasmine.createSpy('dispose'),
        };

        userStateServiceMock.onLogin.subscribe.and.callFake(() => loginDisposeMock);
        userStateServiceMock.onLogout.subscribe.and.callFake(() => logoutDisposeMock);

        headerController.$onInit();

        expect(userStateServiceMock.onLogin.subscribe)
            .toHaveBeenCalledWith(jasmine.any(Function));

        expect(userStateServiceMock.onLogout.subscribe)
            .toHaveBeenCalledWith(jasmine.any(Function));

        headerController.$onDestroy();

        expect(loginDisposeMock.dispose)
            .toHaveBeenCalledTimes(1);

        expect(logoutDisposeMock.dispose)
            .toHaveBeenCalledTimes(1);

    });

    it('should not set an initial authentication when user is not logged in', () => {

        userStateServiceMock.isLoggedIn = false;

        headerController.$onInit();

        expect(headerController.authentication)
            .not
            .toBe(userStateServiceMock.authentication);

    });

    it('should set an initial authentication when user is logged in', () => {

        userStateServiceMock.isLoggedIn = true;

        headerController.$onInit();

        expect(headerController.authentication)
            .toBe(userStateServiceMock.authentication);

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

        headerController.$onInit();

        $rootScope.$digest();

        expect(headerController.authentication)
            .toBe(userStateServiceMock.authentication);

        expect(headerController.profile)
            .toBe(testProfile);

        logoutSubscriber();

        expect(headerController.authentication)
            .not
            .toBe(userStateServiceMock.authentication);

        expect(headerController.profile)
            .not
            .toBe(testProfile);

    });

    describe('.isLoggedIn', () => {

        it('should return the logged in status of the user', () => {

            function testLoggedInStatus(loggedIn) {

                userStateServiceMock.isLoggedIn = loggedIn;

                expect(headerController.isLoggedIn)
                    .toEqual(loggedIn);

            }

            testLoggedInStatus(false);
            testLoggedInStatus(true);

        });

    });

    describe('.profileName', () => {

        it('should return an empty stub for the user\'s profile name when profile is not set yet', () => {

            expect(headerController.profile)
                .toBeUndefined();

            expect(headerController.profileName)
                .toEqual({});

        });

        it('should return the user\'s profile name when profile is set', () => {

            userStateServiceMock.onLogin.subscribe
                .and
                .callFake(
                    subscriber => subscriber(mockEvent, userStateServiceMock.authentication),
                );

            headerController.$onInit();

            $rootScope.$digest();

            expect(headerController.profileName)
                .toBe(testProfile.name);

        });

    });

});
