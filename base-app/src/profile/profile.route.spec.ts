import _ from 'lodash';
import angular from 'angular';
import uiRouter, { StateProvider } from '@uirouter/angularjs';

import { ProfileModule } from './profile.module';
import { ProfileStateId, profileRoute } from './profile.route';
import { UserStateServiceName } from '../core/user-state/user-state.service';
import { ProfileServiceName } from '../core/backend/profile.service';
import { ProfileView } from './models/profile-view.model';
import { ProfileViewBindingName } from './profile.controller';
import { EventEmitterServiceName } from '../core/event-emitter/event-emitter.service';

describe(`${ProfileModule} route config`, () => {

    let $stateProviderMock: jasmine.SpyObj<StateProvider>;

    let $injector: angular.auto.IInjectorService;

    beforeEach(() => {

        angular.mock.module(uiRouter, ($stateProvider: jasmine.SpyObj<StateProvider>) => {
            $stateProviderMock = $stateProvider;
            spyOn($stateProviderMock, 'state');
        });

        angular.mock.module(ProfileModule);

        inject((_$injector_) => {
            $injector = _$injector_;
        });

    });

    describe('given architecture', () => {

        const expectedInjects = [
            '$stateProvider',
        ];

        it(`should only depend on ${expectedInjects.join(',')}`, () => {

            expect(_.sortBy($injector.annotate(profileRoute)))
                .toEqual(_.sortBy(expectedInjects));

        });

    });

    it(`should setup state ${ProfileStateId}`, () => {

        expect($stateProviderMock.state)
            .toHaveBeenCalledWith(jasmine.objectContaining({
                name: ProfileStateId,
            }));

    });

    describe(`${ProfileStateId} resolve`, () => {

        const testAuthentication = {
            id: 'test',
        };

        const testProfile = {
            test: true,
        };

        const resolvers = [
            'authentication',
            'profile',
            ProfileViewBindingName,
        ];

        let resolve: Record<string, any[]>;

        beforeEach(() => {
            resolve = _.get(
                $stateProviderMock.state.calls.first(),
                'args.0.resolve',
            );
        });

        it(`should only have resolvers ${resolvers.join(',')}`, () => {
            expect(_.sortBy(_.keys(resolve)))
                .toEqual(_.sortBy(resolvers));
        });

        describe('.authentication', () => {

            const resolverInjects = [
                UserStateServiceName,
            ];

            let resolver: any[];
            let resolverFn: Function;

            beforeEach(() => {
                resolver = resolve.authentication;
                resolverFn = _.last(resolver);
            });

            it(`should only depend on ${resolverInjects.join(',')}`, () => {
                expect(_.sortBy($injector.annotate(resolver)))
                    .toEqual(_.sortBy(resolverInjects));
            });

            it(`should resolve a copy of the authentication data from ${UserStateServiceName}`, () => {
                expect(resolverFn({ authentication: testAuthentication }))
                    .toEqual(testAuthentication);
            });

        });

        describe('.profile', () => {

            const resolverInjects = [
                ProfileServiceName,
                'authentication',
            ];

            let resolver: any[];
            let resolverFn: Function;

            beforeEach(() => {
                resolver = resolve.profile;
                resolverFn = _.last(resolver);
            });

            it(`should only depend on ${resolverInjects.join(',')}`, () => {
                expect(_.sortBy($injector.annotate(resolver)))
                    .toEqual(_.sortBy(resolverInjects));
            });

            it(`should resolve the profile from ${ProfileServiceName}`, () => {
                const profileServiceMock = {
                    getProfile: jasmine.createSpy()
                        .and
                        .returnValue(testProfile),
                };

                expect(
                    resolverFn(profileServiceMock, testAuthentication),
                ).toBe(testProfile);

                expect(profileServiceMock.getProfile)
                    .toHaveBeenCalledWith(testAuthentication.id);
            });

        });

        describe(`.${ProfileViewBindingName}`, () => {

            const resolverInjects = [
                EventEmitterServiceName,
                'authentication',
                'profile',
            ];

            let resolver: any[];
            let resolverFn: Function;

            beforeEach(() => {
                resolver = resolve[ProfileViewBindingName];
                resolverFn = _.last(resolver);
            });

            it(`should only depend on ${resolverInjects.join(',')}`, () => {
                expect(_.sortBy($injector.annotate(resolver)))
                    .toEqual(_.sortBy(resolverInjects));
            });

            it('should resolve to a ProfileView', () => {
                const eventEmitterServiceMock = {
                    of: jasmine.createSpy()
                        .and.returnValue({}),
                } as any;

                expect(
                    resolverFn(eventEmitterServiceMock, testAuthentication, testProfile),
                ).toEqual(jasmine.any(ProfileView));
            });

        });

    });

});
