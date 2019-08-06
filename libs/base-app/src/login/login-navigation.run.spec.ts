import _ from 'lodash';
import angular from 'angular';

import { LoginModule } from './login.module';
import { LoginStateId } from './login.route';
import { NavigationServiceName, NavigationService } from '../core/navigation/navigation.service';
import { loginNavigationRun } from './login-navigation.run';
import { RequiresLoginStateAccessGuardService, RequiresLoginStateAccessGuardServiceName } from '../core/state-access-control/requires-login-state-access-guard/requires-login-state-access-guard.service';

describe(`${LoginModule} navigation run`, () => {

    let navigationServiceMock: NavigationService;
    let requiresLoginStateAccessGuardServiceMock: RequiresLoginStateAccessGuardService;

    let $injector: angular.auto.IInjectorService;

    beforeEach(() => {

        navigationServiceMock = {
            forState: jasmine.createSpy('forState'),
        } as any;

        requiresLoginStateAccessGuardServiceMock = {
            setLoginStateName: jasmine.createSpy(),
        } as any;

        angular.mock.module(LoginModule, {
            [NavigationServiceName]: navigationServiceMock,
            [RequiresLoginStateAccessGuardServiceName]: requiresLoginStateAccessGuardServiceMock,
        });

        inject((_$injector_) => {
            $injector = _$injector_;
        });

    });

    describe('given architecture', () => {

        const expectedInjects = [
            NavigationServiceName,
            RequiresLoginStateAccessGuardServiceName,
        ];

        it(`should only depend on ${expectedInjects.join(',')}`, () => {
            expect(_.sortBy($injector.annotate(loginNavigationRun)))
                .toEqual(_.sortBy(expectedInjects));
        });

    });

    it(`should provide a navigation entry for state ${LoginStateId}`, () => {

        expect(navigationServiceMock.forState)
            .toHaveBeenCalledWith(jasmine.any(String), LoginStateId);

    });

    it('should provide the state for redirection to login for protected states', () => {

        expect(requiresLoginStateAccessGuardServiceMock.setLoginStateName)
            .toHaveBeenCalledWith(LoginStateId);

    });

});
