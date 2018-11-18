import { MenubarModule } from './menubar.module';
import { MenubarName } from './menubar.component';
import { MenubarController } from './menubar.controller';

describe(`${MenubarModule}.${MenubarName} component controller`, () => {

    let menubarController;

    beforeEach(() => {

        angular.mock.module(MenubarModule);

        inject(($componentController) => {
            menubarController = $componentController(MenubarName);
        });

    });

    it(`should be an instanceof ${MenubarName} component controller`, () => {

        expect(menubarController)
            .toEqual(jasmine.any(MenubarController));

    });

});
