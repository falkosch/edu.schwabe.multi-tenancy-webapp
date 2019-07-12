import _ from 'lodash';
import angular from 'angular';
import uiRouter from '@uirouter/angularjs';

import { ProfileModule } from './profile.module';
import { ProfileStateId, profileRoute } from './profile.route';
import { UserStateServiceName } from '../core/user-state/user-state.service';
import { ProfileServiceName } from '../core/backend/profile.service';
import { InjectionServiceName } from '../core/annotations/injection.service';
import { ProfileViewModel } from './profile.viewmodel';

describe(`${ProfileModule} route config`, () => {

    let $stateProviderMock;

    let $injector;

    beforeEach(() => {

        angular.mock.module(uiRouter, ($stateProvider) => {
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

        const authentication = {
            id: 'test',
        };

        const profile = {
            test: true,
        };

        const resolvers = [
            'authentication',
            'profile',
            'viewmodel',
        ];

        let resolve;

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

            let resolver;
            let resolverFn;

            beforeEach(() => {
                resolver = resolve.authentication;
                resolverFn = _.last(resolver);
            });

            it(`should only depend on ${resolverInjects.join(',')}`, () => {
                expect(_.sortBy($injector.annotate(resolver)))
                    .toEqual(_.sortBy(resolverInjects));
            });

            it(`should resolve a copy of the authentication data from ${UserStateServiceName}`, () => {
                expect(resolverFn({ authentication }))
                    .toEqual(authentication);
            });

        });

        describe('.profile', () => {

            const resolverInjects = [
                ProfileServiceName,
                'authentication',
            ];

            let resolver;
            let resolverFn;

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
                        .returnValue(profile),
                };

                expect(
                    resolverFn(profileServiceMock, authentication),
                ).toBe(profile);

                expect(profileServiceMock.getProfile)
                    .toHaveBeenCalledWith(authentication.id);
            });

        });

        describe('.viewmodel', () => {

            const resolverInjects = [
                InjectionServiceName,
                'authentication',
                'profile',
            ];

            let resolver;
            let resolverFn;

            beforeEach(() => {
                resolver = resolve.viewmodel;
                resolverFn = _.last(resolver);
            });

            it(`should only depend on ${resolverInjects.join(',')}`, () => {
                expect(_.sortBy($injector.annotate(resolver)))
                    .toEqual(_.sortBy(resolverInjects));
            });

            it('should resolve to a ProfileViewModel', () => {
                const injectionServiceMock = {
                    injectByStaticInjectionNames: jasmine.createSpy()
                        .and
                        .callFake((instance) => {
                            // eslint-disable-next-line no-param-reassign
                            instance.eventEmitterService = {
                                of: jasmine.createSpy(),
                            };
                        }),
                };

                expect(
                    resolverFn(injectionServiceMock, authentication, profile),
                ).toEqual(jasmine.any(ProfileViewModel));
            });

        });

    });

});
