import _ from 'lodash';
import angular from 'angular';

import { GlobalSpinnerModule } from './global-spinner.module';
import { GlobalSpinnerServiceName, GlobalSpinnerService } from './global-spinner.service';
import { PromiseTrackerServiceName } from '../../core/promise-tracker/promise-tracker.service';

describe(`${GlobalSpinnerModule}.${GlobalSpinnerServiceName}`, () => {

    let testUnit;

    let mockIsBusy;
    let promiseTrackerServiceMock;

    let $injector;
    let $q;

    beforeEach(() => {

        mockIsBusy = false;

        promiseTrackerServiceMock = {
            get isBusy() {
                return mockIsBusy;
            },
            track: jasmine.createSpy('track')
                .and.callFake(promise => promise),
        };

        angular.mock.module(GlobalSpinnerModule, {
            [PromiseTrackerServiceName]: promiseTrackerServiceMock,
        });

        inject((_$injector_, _$q_) => {
            $injector = _$injector_;
            $q = _$q_;

            testUnit = $injector.get(GlobalSpinnerServiceName);
        });

    });

    describe('given architecture', () => {

        const expectedInjects = [
            PromiseTrackerServiceName,
        ];

        it(`should only depend on ${expectedInjects.join(',')}`, () => {
            expect(_.sortBy($injector.annotate(GlobalSpinnerService)))
                .toEqual(_.sortBy(expectedInjects));
        });

        it(`should be an instanceof ${GlobalSpinnerService.name}`, () => {
            expect(testUnit)
                .toEqual(jasmine.any(GlobalSpinnerService));
        });

    });

    describe('.isBusy', () => {

        it(`should passthrough the return value of ${PromiseTrackerServiceName}.isBusy`, () => {

            mockIsBusy = true;

            expect(testUnit.isBusy)
                .toEqual(true);

            mockIsBusy = false;

            expect(testUnit.isBusy)
                .toEqual(false);

        });

    });

    describe('.spinWhilePromise()', () => {

        it(`should pass the given promise to ${PromiseTrackerServiceName}.track and return the same promise again`, () => {

            const promise = $q.when();

            expect(testUnit.spinWhilePromise(promise))
                .toBe(promise);

            expect(promiseTrackerServiceMock.track)
                .toHaveBeenCalledWith(promise);

        });

    });

    describe('.spinWhileTransition()', () => {

        it(`should pass the promise of the given transition to ${PromiseTrackerServiceName}.track and return that promise again`, () => {

            const transition = {
                promise: $q.when(),
            };

            expect(testUnit.spinWhileTransition(transition))
                .toBe(transition.promise);

            expect(promiseTrackerServiceMock.track)
                .toHaveBeenCalledWith(transition.promise);

        });

    });

});
