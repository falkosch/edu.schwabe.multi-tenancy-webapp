import _ from 'lodash';
import angular from 'angular';

import { AppModule } from './app.module';
import { AppComponentName } from './app.component';
import { AppController } from './app.controller';
import { GlobalSpinnerServiceName } from '../ui/global-spinner/global-spinner.service';

describe(`${AppModule}.${AppComponentName} controller`, () => {

    let mockIsBusy;

    let testUnit;

    let toggleSpy;
    let $mdSidenavMock;

    let $injector;

    beforeEach(() => {

        mockIsBusy = false;

        toggleSpy = jasmine.createSpy('toggle');

        $mdSidenavMock = jasmine.createSpy('$mdSidenav')
            .and
            .returnValue({ toggle: toggleSpy });

        angular.mock.module(AppModule);

        inject(($componentController, _$injector_) => {
            $injector = _$injector_;

            testUnit = $componentController(AppComponentName, {
                $mdSidenav: $mdSidenavMock,
                [GlobalSpinnerServiceName]: {
                    get isBusy() {
                        return mockIsBusy;
                    },
                },
            });
        });

    });

    describe('given architecture', () => {

        const expectedInjects = [
            '$mdSidenav',
            GlobalSpinnerServiceName,
        ];

        it(`should only depend on ${expectedInjects.join(',')}`, () => {
            expect(_.sortBy($injector.annotate(AppController)))
                .toEqual(_.sortBy(expectedInjects));
        });

        it(`should be an instanceof ${AppController.name}`, () => {
            expect(testUnit)
                .toEqual(jasmine.any(AppController));
        });

    });

    describe('.isBusy', () => {

        it(`should passthrough the return value of ${GlobalSpinnerServiceName}.isBusy`, () => {

            mockIsBusy = true;

            expect(testUnit.isBusy)
                .toEqual(true);

            mockIsBusy = false;

            expect(testUnit.isBusy)
                .toEqual(false);

        });

    });

    describe('.sideNavId', () => {

        it('should be a string', () => {

            expect(testUnit.sideNavId)
                .toEqual(jasmine.any(String));

        });

        it('should be a non empty string', () => {

            expect(testUnit.sideNavId.length)
                .toBeGreaterThan(0);

        });

    });

    describe('.toggleSideNav', () => {

        it('should invoke $mdSidenav with the .sideNavId and then call .toggle() of the returned object', () => {

            testUnit.toggleSideNav();

            expect($mdSidenavMock)
                .toHaveBeenCalledWith(testUnit.sideNavId);

            expect(toggleSpy)
                .toHaveBeenCalledTimes(1);

        });

    });

});
