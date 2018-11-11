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

    let $scope;
    let navController;

    beforeEach(() => {

        angular.mock.module(NavModule);

        inject(($rootScope, $componentController) => {
            $scope = $rootScope.$new();
            navController = $componentController(NavName, {
                $scope,
                [NavServiceName]: navServiceMock,
            });
        });
    });

    it(`should be an instanceof ${NavName} component controller`, () => {

        expect(navController)
            .toEqual(jasmine.any(NavController));

    });

    it(`should put ${NavServiceName}.entries on "this" when ${NavName}.$onInit is called`, () => {

        navController.$onInit();
        $scope.$digest();

        expect(navController.entries)
            .toEqual(testData);

    });

});
