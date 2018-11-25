import { NavModule } from './nav.module';
import { NavController } from './nav.controller';
import { NavName } from './nav.component';
import { NavigationServiceName } from '../../../core/navigation/navigation.service';

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
                [NavigationServiceName]: navServiceMock,
            });
        });

    });

    it(`should be an instanceof ${NavName} component controller`, () => {

        expect(navController)
            .toEqual(jasmine.any(NavController));

    });

    it(`should put ${NavigationServiceName}.entries on "this" when ${NavName}.$onInit is called`, () => {

        inject(($rootScope) => {
            navController.$onInit();
            $rootScope.$digest();

            expect(navController.entries)
                .toEqual(testData);

        });

    });

});
