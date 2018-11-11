import { AppModule } from './app.module';
import { AppName } from './app.component';
import { AppController } from './app.controller';
import { PromiseTrackerServiceName } from './core/promise-tracker/promise-tracker.service';

describe(`${AppModule}.${AppName} component controller`, () => {

    const promiseTrackerServiceMock = {
        isBusy: false,
    };

    let toggleSpy;
    let $mdSidenavMock;

    let appController;

    beforeEach(() => {

        toggleSpy = jasmine.createSpy('toggle');

        $mdSidenavMock = jasmine.createSpy('$mdSidenav')
            .and.returnValue({ toggle: toggleSpy });

        angular.mock.module(AppModule);

        inject(($componentController) => {
            appController = $componentController(AppName, {
                $mdSidenav: $mdSidenavMock,
                [PromiseTrackerServiceName]: promiseTrackerServiceMock,
            });
        });

    });

    it(`should be an instanceof ${AppName} component controller`, () => {

        expect(appController)
            .toEqual(jasmine.any(AppController));

    });

    describe('.isBusy', () => {

        it(`should passthrough the return value of ${PromiseTrackerServiceName}.isBusy`, () => {

            promiseTrackerServiceMock.isBusy = false;

            expect(appController.isBusy)
                .toEqual(promiseTrackerServiceMock.isBusy);

            promiseTrackerServiceMock.isBusy = true;

            expect(appController.isBusy)
                .toEqual(promiseTrackerServiceMock.isBusy);

        });

    });

    describe('.sideNavId', () => {

        it('should be a string', () => {

            expect(appController.sideNavId)
                .toEqual(jasmine.any(String));

        });

        it('should be a non empty string', () => {

            expect(appController.sideNavId.length)
                .toBeGreaterThan(0);

        });

    });

    describe('.toggleSideNav', () => {

        it(`should invoke $mdSidenav with ${AppName}.sideNavId and then call .toggle() of the returned object`, () => {

            appController.toggleSideNav();

            expect($mdSidenavMock)
                .toHaveBeenCalledWith(appController.sideNavId);

            expect(toggleSpy)
                .toHaveBeenCalledTimes(1);

        });

    });

});
