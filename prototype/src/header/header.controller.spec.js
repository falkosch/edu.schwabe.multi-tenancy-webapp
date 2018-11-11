import { HeaderModule } from './header.module';
import { HeaderName } from './header.component';
import { HeaderController } from './header.controller';

describe(`${HeaderModule}.${HeaderName} component controller`, () => {

    let headerController;

    beforeEach(() => {

        angular.mock.module(HeaderModule);

        inject(($componentController) => {

            headerController = $componentController(HeaderName);
        });

    });

    it(`should be an instanceof ${HeaderName} component controller`, () => {

        expect(headerController)
            .toEqual(jasmine.any(HeaderController));

    });

});
