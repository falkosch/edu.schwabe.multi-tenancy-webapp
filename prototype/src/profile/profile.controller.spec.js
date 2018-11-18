import { ProfileModule } from './profile.module';
import { ProfileController } from './profile.controller';
import { ProfileName } from './profile.component';

describe(`${ProfileModule}.${ProfileName} component controller`, () => {

    let profileController;

    beforeEach(() => {

        angular.mock.module(ProfileModule);

        inject(($componentController) => {
            profileController = $componentController(ProfileName);
        });

    });

    it(`should be an instanceof ${ProfileName} component controller`, () => {

        expect(profileController)
            .toEqual(jasmine.any(ProfileController));

    });

});
