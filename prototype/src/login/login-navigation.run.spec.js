import angular from 'angular';

import { LoginModule } from './login.module';
import { LoginStateId } from './login.route';
import { NavigationServiceName } from '../core/navigation/navigation.service';

describe(`${LoginModule} navigation run`, () => {

    let navServiceMock;

    beforeEach(() => {

        navServiceMock = {
            forState: jasmine.createSpy('forState'),
        };

        angular.mock.module(LoginModule, ($provide) => {
            $provide.value(NavigationServiceName, navServiceMock);
        });

        inject();

    });

    it(`should provide a navigation entry for state ${LoginStateId}`, () => {

        expect(navServiceMock.forState)
            .toHaveBeenCalledWith(jasmine.any(String), LoginStateId);

    });

});
