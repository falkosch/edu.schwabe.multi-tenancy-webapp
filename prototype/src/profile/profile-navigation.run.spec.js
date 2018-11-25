import { ProfileModule } from './profile.module';
import { ProfileStateId } from './profile.route';
import { NavigationServiceName } from '../core/navigation/navigation.service';

describe(`${ProfileModule} navigation run`, () => {

    let navServiceMock;

    beforeEach(() => {

        navServiceMock = {
            forState: jasmine.createSpy('forState'),
        };

        angular.mock.module(ProfileModule, ($provide) => {
            $provide.value(NavigationServiceName, navServiceMock);
        });

        inject();

    });

    it(`should provide a navigation entry for state ${ProfileStateId}`, () => {

        expect(navServiceMock.forState)
            .toHaveBeenCalledWith(jasmine.any(String), ProfileStateId);

    });

});
