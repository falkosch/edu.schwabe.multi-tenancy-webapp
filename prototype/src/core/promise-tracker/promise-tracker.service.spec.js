import angular from 'angular';
import _ from 'lodash';

import { PromiseTrackerServiceName, PromiseTrackerService } from './promise-tracker.service';
import { PromiseTrackerModule } from './promise-tracker.module';

describe(`${PromiseTrackerModule}.${PromiseTrackerServiceName}`, () => {

    let $q;
    let $rootScope;
    let promiseTrackerService;

    beforeEach(() => {

        angular.mock.module(PromiseTrackerModule);

        inject((_$q_, _$rootScope_, _promiseTrackerService_) => {
            $q = _$q_;
            $rootScope = _$rootScope_;
            promiseTrackerService = _promiseTrackerService_;
        });

    });

    it(`should be an instanceof ${PromiseTrackerServiceName}`, () => {

        expect(promiseTrackerService)
            .toEqual(jasmine.any(PromiseTrackerService));

    });

    it('should also be the global promise tracker instance', () => {

        expect(promiseTrackerService.track)
            .toEqual(jasmine.any(Function));

        expect(promiseTrackerService.isIdling)
            .toEqual(jasmine.any(Boolean));

        expect(promiseTrackerService.isBusy)
            .toEqual(jasmine.any(Boolean));

    });

    describe('.createTracker', () => {

        it('should return a new local promise tracker instance', () => {

            const newTracker = PromiseTrackerService.createTracker();

            expect(newTracker)
                .not.toEqual(promiseTrackerService);

            expect(newTracker.track)
                .toEqual(jasmine.any(Function));

            expect(newTracker.isIdling)
                .toEqual(jasmine.any(Boolean));

            expect(newTracker.isBusy)
                .toEqual(jasmine.any(Boolean));

        });

    });

    describe('.track', () => {

        it('should accept promises', () => {

            const deferred = $q.defer();
            const { promise } = deferred;

            promiseTrackerService.track(promise);

            expect(promiseTrackerService.tracked)
                .toContain(promise);

        });

        it('should accept anything but not track it', () => {

            promiseTrackerService.track(undefined);
            promiseTrackerService.track(null);
            promiseTrackerService.track(0);
            promiseTrackerService.track(1);
            promiseTrackerService.track(0.1);
            promiseTrackerService.track('');
            promiseTrackerService.track('any');
            promiseTrackerService.track([]);
            promiseTrackerService.track({});

            expect(promiseTrackerService.tracked)
                .toEqual([]);

        });

    });

    describe('.isIdling and .isBusy', () => {

        it('should be idling and not busy on initialization', () => {

            expect(promiseTrackerService.isIdling)
                .toEqual(true);

            expect(promiseTrackerService.isBusy)
                .toEqual(false);

        });

        it('should be not idling and busy when a promise is tracked', () => {

            const deferred = $q.defer();
            const { promise } = deferred;

            promiseTrackerService.track(promise);

            expect(promiseTrackerService.isIdling)
                .toEqual(false);

            expect(promiseTrackerService.isBusy)
                .toEqual(true);

        });

        it('should be idling and not busy again when promise gets resolved', () => {

            const deferred = $q.defer();
            const { promise } = deferred;

            promiseTrackerService.track(promise);

            deferred.resolve();
            $rootScope.$digest();

            expect(promiseTrackerService.isIdling)
                .toEqual(true);

            expect(promiseTrackerService.isBusy)
                .toEqual(false);

        });

        it('should be idling and not busy again when promise gets rejected', () => {

            const deferred = $q.defer();
            // the catch handles the reject appropriately, so that no error is thrown by angular
            const promise = deferred.promise.catch(_.noop);

            promiseTrackerService.track(promise);

            deferred.reject();
            $rootScope.$digest();

            expect(promiseTrackerService.isIdling)
                .toEqual(true);

            expect(promiseTrackerService.isBusy)
                .toEqual(false);

        });

    });

});
