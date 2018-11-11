import { NavServiceName } from '../header/nav/nav.service';
import { StartModule } from './start.module';
import { StartStateId } from './start.route';

describe(`${StartModule} navigation run`, () => {

    let navServiceMock;

    beforeEach(() => {

        navServiceMock = {
            forState: jasmine.createSpy('forState'),
        };

        angular.mock.module(StartModule, ($provide) => {
            $provide.value(NavServiceName, navServiceMock);
        });

        inject();

    });

    it(`should provide a navigation entry for state ${StartStateId}`, () => {

        expect(navServiceMock.forState)
            .toHaveBeenCalledWith(jasmine.any(String), StartStateId);

    });

});
