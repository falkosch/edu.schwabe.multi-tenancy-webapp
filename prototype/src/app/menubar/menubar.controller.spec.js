import angular from 'angular';
import _ from 'lodash';

import { MenubarModule } from './menubar.module';
import { MenubarName } from './menubar.component';
import { MenubarController } from './menubar.controller';
import { UserStateServiceName } from '../../core/user-state/user-state.service';
import { GlobalSpinnerServiceName } from '../../ui/global-spinner/global-spinner.service';
import { ProfileServiceName } from '../../core/backend/profile.service';

describe(`${MenubarModule}.${MenubarName} component controller`, () => {

    const $stateMockWithTitle = {
        current: {
            data: {
                title: 'mocked',
            },
            name: 'mockedName',
        },
    };

    const $stateMockWithOnlyName = {
        current: {
            name: 'mockedOnlyName',
        },
    };

    let menubarController;

    beforeEach(() => {

        angular.mock.module(MenubarModule);

    });

    it(`should be an instanceof ${MenubarName} component controller`, () => {

        inject(($componentController) => {

            menubarController = $componentController(MenubarName, {
                $state: $stateMockWithTitle,
            });

            expect(menubarController)
                .toEqual(jasmine.any(MenubarController));

        });

    });

    describe('.currentStateTitle', () => {

        it('should return a string of a current state title', () => {

            inject(($componentController) => {

                menubarController = $componentController(MenubarName, {
                    $state: $stateMockWithTitle,
                });

                expect(menubarController.currentStateTitle)
                    .toEqual(jasmine.any(String));

            });

        });

        it('should not return the state name when there is a "data.title" set', () => {

            inject(($componentController) => {

                menubarController = $componentController(MenubarName, {
                    $state: $stateMockWithTitle,
                });

                expect(menubarController.currentStateTitle)
                    .toEqual($stateMockWithTitle.current.data.title);

                expect(menubarController.currentStateTitle)
                    .not.toEqual($stateMockWithTitle.current.name);

                expect(menubarController.currentStateTitle)
                    .not.toEqual($stateMockWithOnlyName.current.name);

            });

        });

        it('should return the state name when there is no "data.title" set', () => {

            inject(($componentController) => {

                menubarController = $componentController(MenubarName, {
                    $state: $stateMockWithOnlyName,
                });

                expect(menubarController.currentStateTitle)
                    .toEqual($stateMockWithOnlyName.current.name);

                expect(menubarController.currentStateTitle)
                    .not.toEqual($stateMockWithTitle.current.data.title);

                expect(menubarController.currentStateTitle)
                    .not.toEqual($stateMockWithTitle.current.name);

            });

        });

    });

    describe('.profileName', () => {

        it('should return the name part of the profile', () => {

            inject(($componentController) => {

                const profileMock = {
                    name: {
                        first: 'test',
                    },
                };

                menubarController = $componentController(MenubarName, {}, {
                    // bindings
                    profile: profileMock,
                });

                expect(menubarController.profile)
                    .toBe(profileMock);

                expect(menubarController.profileName)
                    .toBe(profileMock.name);

            });

        });

    });

    describe('.$onInit()', () => {

        it(`should subscribe to ${UserStateServiceName}.onLogin and ${UserStateServiceName}.onLogout and initially call ${ProfileServiceName}.getProfile()`, () => {

            inject(($componentController) => {

                const userStateServiceMock = {
                    onLogin: {
                        subscribe: jasmine.createSpy('subscribe'),
                    },
                    onLogout: {
                        subscribe: jasmine.createSpy('subscribe'),
                    },
                };

                menubarController = $componentController(MenubarName, {
                    [UserStateServiceName]: userStateServiceMock,
                });

                menubarController.$onInit();

                expect(userStateServiceMock.onLogin.subscribe)
                    .toHaveBeenCalledWith(jasmine.any(Function));

                expect(userStateServiceMock.onLogout.subscribe)
                    .toHaveBeenCalledWith(jasmine.any(Function));

            });

        });

        it(`should initially call ${ProfileServiceName}.getProfile() when user is logged in`, () => {

            inject(($rootScope, $q, $componentController) => {

                const profileMock = {};

                const profilePromise = $q.when(profileMock);

                const userStateServiceMock = {
                    isLoggedIn: true,
                    authentication: {
                        id: 'test',
                    },
                    onLogin: {
                        subscribe: _.noop,
                    },
                    onLogout: {
                        subscribe: _.noop,
                    },
                };

                const profileServiceMock = {
                    getProfile: jasmine.createSpy('getProfile')
                        .and.returnValue(profilePromise),
                };

                menubarController = $componentController(MenubarName, {
                    [UserStateServiceName]: userStateServiceMock,
                    [ProfileServiceName]: profileServiceMock,
                });

                menubarController.$onInit();

                $rootScope.$digest();

                expect(profileServiceMock.getProfile)
                    .toHaveBeenCalledWith(userStateServiceMock.authentication.id);

            });

        });

    });

    describe('.$onDestroy()', () => {

        it('should dispose the onLogin and onLogout subscription', () => {

            inject(($componentController) => {

                const onLoginDisposal = {
                    dispose: jasmine.createSpy('dispose'),
                };

                const onLogoutDisposal = {
                    dispose: jasmine.createSpy('dispose'),
                };

                const userStateServiceMock = {
                    onLogin: {
                        subscribe: jasmine.createSpy('subscribe')
                            .and.returnValue(onLoginDisposal),
                    },
                    onLogout: {
                        subscribe: jasmine.createSpy('subscribe')
                            .and.returnValue(onLogoutDisposal),
                    },
                };

                menubarController = $componentController(MenubarName, {
                    [UserStateServiceName]: userStateServiceMock,
                });

                menubarController.$onInit();
                menubarController.$onDestroy();

                expect(onLoginDisposal.dispose)
                    .toHaveBeenCalledTimes(1);

                expect(onLogoutDisposal.dispose)
                    .toHaveBeenCalledTimes(1);

            });

        });

    });

    describe('.logout()', () => {

        it(`should call ${UserStateServiceName}.logout() and return the promise of it`, () => {

            inject(($q, $componentController) => {

                const logoutPromise = $q.when({});

                const globalSpinnerServiceMock = {
                    spinWhilePromise: promise => promise,
                };

                const userStateServiceMock = {
                    logout: jasmine.createSpy('logout')
                        .and.returnValue(logoutPromise),
                };

                menubarController = $componentController(MenubarName, {
                    [GlobalSpinnerServiceName]: globalSpinnerServiceMock,
                    [UserStateServiceName]: userStateServiceMock,
                });

                expect(menubarController.logout())
                    .toBe(logoutPromise);

                expect(userStateServiceMock.logout)
                    .toHaveBeenCalledTimes(1);

            });

        });

    });

});
