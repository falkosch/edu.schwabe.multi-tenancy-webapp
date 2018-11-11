import { NavServiceName } from '../header/nav/nav.service';
import { LoginModule } from './login.module';
import { LoginStateId } from './login.route';

describe(`${LoginModule} navigation run`, () => {

    let navServiceMock;

    beforeEach(() => {

        navServiceMock = {
            forState: jasmine.createSpy('forState'),
        };

        angular.mock.module(LoginModule, ($provide) => {
            $provide.value(NavServiceName, navServiceMock);
        });

        inject();

    });

    it(`should provide a navigation entry for state ${LoginStateId}`, () => {

        expect(navServiceMock.forState)
            .toHaveBeenCalledWith(jasmine.any(String), LoginStateId);

    });

});
