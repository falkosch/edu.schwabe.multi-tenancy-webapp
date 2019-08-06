import _ from 'lodash';
import angular from 'angular';
import { Transition } from '@uirouter/core';

import { StateAccessControlModule } from './state-access-control.module';
import { StateAccessControlServiceName, StateAccessControlService } from './state-access-control.service';
import { StateAccessControlProperty } from './state-access-control-decorator.config';
import { StateAccessGuard } from './models/state-access-guard.model';
import { AllowanceAccessValue } from './models/allowance-access-value.model';
import { DenialAccessValue } from './models/denial-access-value.model';

describe(`${StateAccessControlModule}.${StateAccessControlServiceName}`, () => {

    let testUnit: StateAccessControlService;

    let stateAccessGuardMocks: Record<string, jasmine.SpyObj<StateAccessGuard>>;
    let guardsMock: Record<string, string>;

    let $injector: angular.auto.IInjectorService;
    let $rootScope: angular.IRootScopeService;
    let $q: angular.IQService;

    beforeEach(() => {

        stateAccessGuardMocks = _.reduce(
            _.times(3),
            (mocks: Record<string, StateAccessGuard>, i: number) => {
                // eslint-disable-next-line no-param-reassign
                mocks[`testStateAccessGuard${i}`] = {
                    authorize: jasmine.createSpy('authorize'),
                };
                return mocks;
            },
            {},
        );

        guardsMock = _.mapValues(stateAccessGuardMocks, (__, k) => k);

        angular.mock.module(StateAccessControlModule, {
            ...stateAccessGuardMocks,
        });

        inject((_$injector_, _$rootScope_, _$q_) => {
            $injector = _$injector_;
            $rootScope = _$rootScope_;
            $q = _$q_;

            testUnit = $injector.get(StateAccessControlServiceName);
            testUnit.guards = guardsMock;
        });

    });

    describe('given architecture', () => {

        const expectedInjects = [
            '$injector',
            '$q',
        ];

        it(`should only depend on ${expectedInjects.join(',')}`, () => {
            expect(_.sortBy($injector.annotate(StateAccessControlService)))
                .toEqual(_.sortBy(expectedInjects));
        });

        it(`should be an instanceof ${StateAccessControlService.name}`, () => {
            expect(testUnit)
                .toEqual(jasmine.any(StateAccessControlService));
        });

    });

    describe('.authorize(transition)', () => {

        let testState;

        let transitionMock: Transition;

        function testGuardSetup(done: JasmineDoneFn, testHook = _.noop): void {
            testUnit.authorize(transitionMock)
                .then((accessValue) => {
                    testHook(accessValue.isAuthorized());

                    done();
                })
                .catch((e) => {
                    done.fail(e);
                });

            $rootScope.$digest();
        }

        beforeEach(() => {

            testState = {
                [StateAccessControlProperty]: {
                    ...guardsMock,
                },
            };

            transitionMock = {
                to: jasmine.createSpy('to')
                    .and.returnValue(testState),
            } as any;

            _.forEach(stateAccessGuardMocks, (stateAccessGuardMock) => {
                stateAccessGuardMock.authorize
                    .and.returnValue($q.resolve(new AllowanceAccessValue()));
            });

        });

        it('should get the target state for reading guard parameters', (done) => {
            testGuardSetup(done, () => {
                expect(transitionMock.to)
                    .toHaveBeenCalledTimes(1);
            });
        });

        describe('when all guards authorize access to the target state', () => {

            it('should return authorize promise resolved with authorized access', (done) => {
                testGuardSetup(done, (authorized) => {
                    expect(authorized)
                        .toBe(true);
                });
            });

            it('should pass parameters defined in the state to the guards', (done) => {
                testGuardSetup(done, () => {
                    _.forEach(stateAccessGuardMocks, (stateAccessGuardMock, guardProperty) => {
                        const guardParameter = guardProperty;

                        expect(stateAccessGuardMock.authorize)
                            .toHaveBeenCalledWith(transitionMock, guardParameter);
                    });
                });
            });

        });

        describe('when at least one guard does NOT authorize access to the target state', () => {

            it('should return authorize promise resolved with NOT authorized access', (done) => {
                _.forEach(stateAccessGuardMocks, (stateAccessGuardMock) => {
                    stateAccessGuardMock.authorize
                        .and.returnValue($q.resolve(new DenialAccessValue()));

                    testGuardSetup(done, (authorized) => {
                        expect(authorized)
                            .toBe(false);
                    });

                    stateAccessGuardMock.authorize
                        .and.returnValue($q.resolve(new AllowanceAccessValue()));
                });
            });

        });

        describe('when all guards do NOT authorize access to the target state', () => {

            beforeEach(() => {
                _.forEach(stateAccessGuardMocks, (stateAccessGuardMock) => {
                    stateAccessGuardMock.authorize
                        .and.returnValue($q.resolve(new DenialAccessValue()));
                });
            });

            it('should still return authorize promise resolved with NOT authorized access', (done) => {
                testGuardSetup(done, (authorized) => {
                    expect(authorized)
                        .toBe(false);
                });
            });

        });

    });

});
