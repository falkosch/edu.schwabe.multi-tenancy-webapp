import _ from 'lodash';
import angular from 'angular';
import { Transition, TargetState } from '@uirouter/core';

import { RequiresLoginStateAccessGuardModule } from './requires-login-state-access-guard.module';
import { RequiresLoginStateAccessGuardServiceName, RequiresLoginStateAccessGuardService } from './requires-login-state-access-guard.service';
import { UserStateServiceName, UserStateService } from '../../user-state/user-state.service';
import { AccessValue } from '../models/access-value.model';

describe(`${RequiresLoginStateAccessGuardModule}.${RequiresLoginStateAccessGuardServiceName}`, () => {

    const testTargetState: TargetState = {} as any;

    let testUnit: RequiresLoginStateAccessGuardService;

    let userStateServiceMock: UserStateService;
    let transitionMock: Transition;

    let $injector: angular.auto.IInjectorService;
    let $rootScope: angular.IRootScopeService;

    beforeEach(() => {

        userStateServiceMock = {
            isLoggedIn: false,
        } as any;

        transitionMock = {
            router: {
                stateService: {
                    target: jasmine.createSpy('target').and.returnValue(testTargetState),
                },
            },
        } as any;

        angular.mock.module(RequiresLoginStateAccessGuardModule, {
            [UserStateServiceName]: userStateServiceMock,
        });

        inject((_$injector_, _$rootScope_) => {
            $injector = _$injector_;
            $rootScope = _$rootScope_;

            testUnit = $injector.get(RequiresLoginStateAccessGuardServiceName);
        });

    });

    describe('given architecture', () => {

        const expectedInjects = [
            '$q',
            UserStateServiceName,
        ];

        it(`should only depend on ${expectedInjects.join(',')}`, () => {
            expect(_.sortBy($injector.annotate(RequiresLoginStateAccessGuardService)))
                .toEqual(_.sortBy(expectedInjects));
        });

        it(`should be an instanceof ${RequiresLoginStateAccessGuardService.name}`, () => {
            expect(testUnit)
                .toEqual(jasmine.any(RequiresLoginStateAccessGuardService));
        });

    });

    describe('.authorize(transition, requiresLogin)', () => {

        function testAuthorization(
            done: JasmineDoneFn,
            requiresLogin: boolean,
            expectedAuthorized: boolean,
        ): void {
            testUnit.authorize(transitionMock, requiresLogin)
                .then((accessValue: AccessValue<any>) => {

                    expect(accessValue.isAuthorized())
                        .toBe(expectedAuthorized);

                    done();
                })
                .catch((e) => {
                    done.fail(e);
                });

            $rootScope.$digest();
        }

        describe('when login is required for state', () => {

            describe('when user is logged in', () => {

                beforeEach(() => {
                    (userStateServiceMock as any).isLoggedIn = true;
                });

                it('should return a promise that access is authorized', (done) => {
                    testAuthorization(done, true, true);
                });

            });

            describe('when user is NOT logged in', () => {

                beforeEach(() => {
                    (userStateServiceMock as any).isLoggedIn = false;
                });

                it('should return a promise that access is NOT authorized', (done) => {
                    testAuthorization(done, true, false);
                });

            });

        });

        describe('when login is NOT required for state', () => {

            it('should return a promise with that access is authorized', (done) => {
                testAuthorization(done, false, true);
            });

        });

    });

});
