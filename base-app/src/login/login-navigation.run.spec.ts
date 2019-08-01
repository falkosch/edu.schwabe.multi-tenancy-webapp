import _ from 'lodash';
import angular from 'angular';

import { LoginModule } from './login.module';
import { LoginStateId } from './login.route';
import { NavigationServiceName, NavigationService } from '../core/navigation/navigation.service';
import { loginNavigationRun } from './login-navigation.run';

describe(`${LoginModule} navigation run`, () => {

    let navigationServiceMock: NavigationService;

    let $injector: angular.auto.IInjectorService;

    beforeEach(() => {

        navigationServiceMock = {
            forState: jasmine.createSpy('forState'),
        } as any;

        angular.mock.module(LoginModule, {
            [NavigationServiceName]: navigationServiceMock,
        });

        inject((_$injector_) => {
            $injector = _$injector_;
        });

    });

    describe('given architecture', () => {

        const expectedInjects = [
            NavigationServiceName,
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

});