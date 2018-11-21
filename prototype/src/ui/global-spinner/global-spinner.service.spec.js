
import angular from 'angular';

import { GlobalSpinnerModule } from './global-spinner.module';
import { GlobalSpinnerServiceName, GlobalSpinnerService } from './global-spinner.service';
import { PromiseTrackerServiceName } from '../../core/promise-tracker/promise-tracker.service';

describe(`${GlobalSpinnerModule}.${GlobalSpinnerServiceName}`, () => {

    let mockIsBusy;

    let promiseTrackerServiceMock;

    let $q;
    let globalSpinnerService;

    beforeEach(() => {

        mockIsBusy = false;

        promiseTrackerServiceMock = {
            get isBusy() {
                return mockIsBusy;
            },
            track: jasmine.createSpy('track')
                .and.callFake(promise => promise),
        };

        angular.mock.module(GlobalSpinnerModule, ($provide) => {
            $provide.value(PromiseTrackerServiceName, promiseTrackerServiceMock);
        });

        inject((_$q_, _globalSpinnerService_) => {
            $q = _$q_;
            globalSpinnerService = _globalSpinnerService_;
        });

    });

    it(`should be an instanceof ${GlobalSpinnerServiceName}`, () => {

        expect(globalSpinnerService)
            .toEqual(jasmine.any(GlobalSpinnerService));

    });

    describe('.isBusy', () => {

        it(`should passthrough the return value of ${PromiseTrackerServiceName}.isBusy`, () => {

            mockIsBusy = true;

            expect(globalSpinnerService.isBusy)
                .toEqual(true);

            mockIsBusy = false;

            expect(globalSpinnerService.isBusy)
                .toEqual(false);

        });

    });

    describe('.spinWhilePromise', () => {

        it(`should pass the given promise to ${PromiseTrackerServiceName}.track and return the same promise again`, () => {

            const promise = $q.when();

            expect(globalSpinnerService.spinWhilePromise(promise))
                .toBe(promise);

            expect(promiseTrackerServiceMock.track)
                .toHaveBeenCalledWith(promise);

        });

    });

    describe('.spinWhileTransition', () => {

        it(`should pass the promise of the given transition to ${PromiseTrackerServiceName}.track and return that promise again`, () => {

            const transition = {
                promise: $q.when(),
            };

            expect(globalSpinnerService.spinWhileTransition(transition))
                .toBe(transition.promise);

            expect(promiseTrackerServiceMock.track)
                .toHaveBeenCalledWith(transition.promise);

        });

    });

});
