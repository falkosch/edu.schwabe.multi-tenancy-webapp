import _ from 'lodash';
import angular from 'angular';

import { HeaderModule } from './header.module';
import { HeaderComponentName } from './header.component';
import { HeaderController } from './header.controller';
import { UserStateServiceName, UserStateService } from '../../core/user-state/user-state.service';
import { ProfileServiceName, ProfileService, Profile } from '../../core/backend/profile.service';
import { GlobalSpinnerServiceName, GlobalSpinnerService } from '../../ui/global-spinner/global-spinner.service';
import { LanguageServiceName, LanguageService } from '../../core/language/language.service';
import { Authentication } from '../../core/backend/models/authentication.model';
import { EventConsumer } from '../../core/event-emitter/event-emitter.model';
import { AnonymousProfile } from '../../core/mock-backend/models/anonymous-profile.model';

describe(`${HeaderModule}.${HeaderComponentName} controller`, () => {

    const testProfile: Profile = {
        ...new AnonymousProfile(''),
        name: {
            title: 'test',
            first: 'First',
            last: 'Last',
        },
    };

    let testUnit: HeaderController;

    const mockEvent: angular.IAngularEvent = { name: 'test' } as any;

    let userStateServiceMock: jasmine.SpyObj<UserStateService>;
    let profileServiceMock: ProfileService;
    let globalSpinnerServiceMock: GlobalSpinnerService;
    let languageServiceMock: jasmine.SpyObj<LanguageService>;

    let $injector: angular.auto.IInjectorService;
    let $rootScope: angular.IRootScopeService;
    let $q: angular.IQService;

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
        } as any;

        globalSpinnerServiceMock = {
            spinWhilePromise: jasmine.createSpy('spinWhilePromise'),
        } as any;

        profileServiceMock = {
            getProfile: jasmine.createSpy('getProfile')
                .and.callFake(() => $q.resolve(testProfile)),
        } as any;

        languageServiceMock = {
            allAvailableLanguages: ['test1', 'TEST2'],
            currentLanguage: 'TEST2',
            changeLanguage: jasmine.createSpy('changeLanguage'),
        } as any;

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
                    [LanguageServiceName]: languageServiceMock,
                },
            );
        });

    });

    describe('given architecture', () => {

        const expectedInjects = [
            UserStateServiceName,
            ProfileServiceName,
            GlobalSpinnerServiceName,
            LanguageServiceName,
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

        let loginDisposeMock: () => void;

        let logoutDisposeMock: () => void;

        beforeEach(() => {
            (userStateServiceMock.onLogin.subscribe as jasmine.Spy)
                .and.callFake(() => loginDisposeMock);

            (userStateServiceMock.onLogout.subscribe as jasmine.Spy)
                .and.callFake(() => logoutDisposeMock);
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
                loginDisposeMock = jasmine.createSpy();
                logoutDisposeMock = jasmine.createSpy();
            });

            it('should dispose the login and logout subscriptions', () => {
                testUnit.$onInit();
                testUnit.$onDestroy();

                expect(loginDisposeMock)
                    .toHaveBeenCalledTimes(1);

                expect(logoutDisposeMock)
                    .toHaveBeenCalledTimes(1);

            });

        });

    });

    describe('when the component is destroyed before subscribing login and logout events', () => {

        it('should not throw', () => {
            expect(() => testUnit.$onDestroy())
                .not.toThrow();
        });

    });

    describe('when user is not logged in on intialization', () => {

        beforeEach(() => {
            (userStateServiceMock as any).isLoggedIn = false;
        });

        it('should not set an initial authentication', () => {
            testUnit.$onInit();

            expect(testUnit.authentication)
                .not.toBe(userStateServiceMock.authentication);
        });

    });

    describe('when user is logged in on intialization', () => {

        beforeEach(() => {
            (userStateServiceMock as any).isLoggedIn = true;
        });

        it('should set an initial authentication', () => {
            testUnit.$onInit();

            expect(testUnit.authentication)
                .toBe(userStateServiceMock.authentication);
        });

    });

    it('should set or unset authentication and profile on login or logout', () => {

        let logoutSubscriber;

        (userStateServiceMock.onLogin.subscribe as jasmine.Spy).and.callFake(
            (
                subscriber: EventConsumer<Authentication>,
            ) => subscriber(mockEvent, userStateServiceMock.authentication),
        );
        (userStateServiceMock.onLogout.subscribe as jasmine.Spy).and.callFake(
            (subscriber: EventConsumer<undefined>) => { logoutSubscriber = subscriber; },
        );

        testUnit.$onInit();

        $rootScope.$digest();

        expect(testUnit.authentication)
            .toBe(userStateServiceMock.authentication);

        expect(testUnit.profile)
            .toBe(testProfile);

        // @ts-ignore
        logoutSubscriber(mockEvent, undefined);

        expect(testUnit.authentication)
            .not
            .toBe(userStateServiceMock.authentication);

        expect(testUnit.profile)
            .not
            .toBe(testProfile);

    });

    describe('.allAvailableLanguages', () => {

        it('should return the available languages', () => {
            expect(testUnit.allAvailableLanguages)
                .toEqual(languageServiceMock.allAvailableLanguages);
        });

    });

    describe('.currentLanguage', () => {

        it('should return the current language', () => {
            expect(testUnit.currentLanguage)
                .toBe(languageServiceMock.currentLanguage);
        });

    });

    describe('.isLoggedIn', () => {

        it('should return the logged in status of the user', () => {

            function testLoggedInStatus(loggedIn: boolean): void {

                (userStateServiceMock as any).isLoggedIn = loggedIn;

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
                (userStateServiceMock.onLogin.subscribe as jasmine.Spy)
                    .and.stub();
            });

            it('should return an empty stub for the user\'s profile name', () => {

                testUnit.$onInit();

                $rootScope.$digest();

                expect(profileServiceMock.getProfile)
                    .toHaveBeenCalledTimes(0);

                expect(testUnit.profile)
                    .toBeUndefined();

                expect(testUnit.profileName)
                    .toBeUndefined();

            });

        });

        describe('when user is logged in and profile will be set', () => {

            beforeEach(() => {
                (userStateServiceMock.onLogin.subscribe as jasmine.Spy)
                    .and.callFake(
                        (
                            consumer: EventConsumer<Authentication>,
                        ) => consumer(mockEvent, userStateServiceMock.authentication),
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

    describe('.changeLanguage(code)', () => {

        beforeEach(() => {
            languageServiceMock.changeLanguage
                .and.callFake((code) => $q.resolve(code));
        });

        it('should change the language', () => {
            const nextLanguage = _.head(languageServiceMock.allAvailableLanguages) || '';

            testUnit.changeLanguage(nextLanguage);

            expect(languageServiceMock.changeLanguage)
                .toHaveBeenCalledWith(nextLanguage);
        });

    });

});
