import { PromiseTrackerServiceName, PromiseTrackerService } from './promise-tracker.service';
import { PromiseTrackerModule } from './promise-tracker.module';

describe(`${PromiseTrackerModule}.${PromiseTrackerServiceName}`, () => {

    let $q;
    let promiseTrackerService;

    beforeEach(() => {

        angular.mock.module(PromiseTrackerModule);

        inject((_$q_, _promiseTrackerService_) => {
            $q = _$q_;
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

    describe('.tracked', () => {

        it('should be an array that is empty at first', () => {

            expect(promiseTrackerService.tracked)
                .toEqual([]);

        });

        it('should contain a promise after tracking that promise', () => {

            const deferred = $q.defer();
            const { promise } = deferred;

            promiseTrackerService.track(promise);

            expect(promiseTrackerService.tracked)
                .toContain(promise);

        });


    });

    describe('.isIdling', () => {

    });

    describe('.isBusy', () => {

    });

});
