import angular from 'angular';

import { StartModule } from './start.module';
import { StartStateId } from './start.route';
import { NavigationServiceName } from '../core/navigation/navigation.service';

describe(`${StartModule} navigation run`, () => {

    let navServiceMock;

    beforeEach(() => {

        navServiceMock = {
            forState: jasmine.createSpy('forState'),
        };

        angular.mock.module(StartModule, ($provide) => {
            $provide.value(NavigationServiceName, navServiceMock);
        });

        inject();

    });

    it(`should provide a navigation entry for state ${StartStateId}`, () => {

        expect(navServiceMock.forState)
            .toHaveBeenCalledWith(jasmine.any(String), StartStateId);

    });

});
