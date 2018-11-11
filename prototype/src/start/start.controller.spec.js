import { StartModule } from './start.module';
import { StartController } from './start.controller';
import { StartName } from './start.component';

describe(`${StartModule}.${StartName} component controller`, () => {

    let startController;

    beforeEach(() => {

        angular.mock.module(StartModule);

        inject(($componentController) => {
            startController = $componentController(StartName);
        });

    });

    it(`should be an instanceof ${StartName} component controller`, () => {

        expect(startController)
            .toEqual(jasmine.any(StartController));

    });

});
