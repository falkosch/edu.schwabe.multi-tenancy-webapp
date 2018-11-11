import { NavModule } from './nav.module';
import { NavController } from './nav.controller';
import { NavServiceName } from './nav.service';
import { NavName } from './nav.component';

describe(`${NavModule}.${NavName} component controller`, () => {

    const testData = [{
        text: 'test',
        state: 'Test',
    }];

    const navServiceMock = {
        entries: testData,
    };

    let navController;

    beforeEach(() => {

        angular.mock.module(NavModule);

        inject(($componentController) => {
            navController = $componentController(NavName, {
                [NavServiceName]: navServiceMock,
            });
        });

    });

    it(`should be an instanceof ${NavName} component controller`, () => {

        expect(navController)
            .toEqual(jasmine.any(NavController));

    });

    it(`should put ${NavServiceName}.entries on "this" when ${NavName}.$onInit is called`, () => {

        inject(($rootScope) => {
            navController.$onInit();
            $rootScope.$digest();

            expect(navController.entries)
                .toEqual(testData);

        });

    });

});
