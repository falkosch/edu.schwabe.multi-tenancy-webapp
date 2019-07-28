import _ from 'lodash';
import angular from 'angular';

import { PromiseTrackerServiceName, PromiseTrackerService } from './promise-tracker.service';
import { PromiseTrackerModule } from './promise-tracker.module';
import { PromiseTracker } from './promise-tracker.model';

describe(`${PromiseTrackerModule}.${PromiseTrackerServiceName}`, () => {

    let testUnit: PromiseTrackerService;

    let $injector: angular.auto.IInjectorService;

    beforeEach(() => {

        angular.mock.module(PromiseTrackerModule);

        inject((_$injector_) => {
            $injector = _$injector_;

            testUnit = $injector.get(PromiseTrackerServiceName);
        });

    });

    describe('given architecture', () => {

        const expectedInjects: string[] = [];

        it(`should only depend on ${expectedInjects.join(',')}`, () => {
            expect(_.sortBy($injector.annotate(PromiseTrackerService)))
                .toEqual(_.sortBy(expectedInjects));
        });

        it(`should be an instanceof ${PromiseTrackerService.name}`, () => {
            expect(testUnit)
                .toEqual(jasmine.any(PromiseTrackerService));
        });

    });

    it('should be the global/singleton promise tracker instance', () => {
        expect(testUnit)
            .toEqual(jasmine.any(PromiseTracker));
    });

    // Functionality is covered by specs for class PromiseTracker

});
