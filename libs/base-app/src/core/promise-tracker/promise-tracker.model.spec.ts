import angular from 'angular';

import { PromiseTrackerModule } from './promise-tracker.module';
import { PromiseTracker } from './promise-tracker.model';

describe(`${PromiseTrackerModule}.models.${PromiseTracker.name}`, () => {

    const testResolveValue = 'TEST';
    const testRejectReason = new Error('test');

    let testDeferred: angular.IDeferred<any>;
    let testPromise: angular.IPromise<any>;

    let testUnit: PromiseTracker;

    let $q: angular.IQService;
    let $rootScope: angular.IRootScopeService;

    beforeEach(() => {

        angular.mock.module(PromiseTrackerModule);

        inject((_$q_, _$rootScope_) => {
            $q = _$q_;
            $rootScope = _$rootScope_;

            testUnit = new PromiseTracker();

            testDeferred = $q.defer();
            testPromise = testDeferred.promise;
        });

    });

    describe('.track()', () => {

        it('should accept promises', () => {
            expect(() => testUnit.track(testPromise))
                .not.toThrow();
        });

        describe('when promise gets resolved', () => {

            it('should passthrough the resolved value', (done) => {
                testUnit.track(testPromise)
                    .then((actualResolveValue) => {
                        expect(actualResolveValue)
                            .toBe(testResolveValue);

                        done();
                    })
                    .catch((error) => {
                        done.fail(error);
                    });

                testDeferred.resolve(testResolveValue);

                $rootScope.$digest();
            });

        });

        describe('when promise gets rejected', () => {

            it('should passthrough the rejection reason', (done) => {
                testUnit.track(testPromise)
                    .then(() => {
                        done.fail('test failure');
                    })
                    .catch((reason) => {
                        expect(reason)
                            .toBe(testRejectReason);

                        done();
                    });

                testDeferred.reject(testRejectReason);

                $rootScope.$digest();
            });

        });

    });

    describe('.isIdling() and .isBusy()', () => {

        describe('when nothing is tracked', () => {

            it('should be idling and not busy', () => {
                expect(testUnit.isIdling)
                    .toEqual(true);

                expect(testUnit.isBusy)
                    .toEqual(false);
            });

        });

        describe('when a promise is tracked', () => {

            it('should be not idling and be busy', () => {
                testUnit.track(testPromise);

                expect(testUnit.isIdling)
                    .toEqual(false);

                expect(testUnit.isBusy)
                    .toEqual(true);
            });

            describe('when tracked promise is not resolved or rejected yet', () => {

                it('should resolve or reject the wrapped promise not yet', (done) => {
                    $rootScope.$digest();

                    testUnit.track(testPromise)
                        .then(() => done.fail('test failure'))
                        .catch(() => done.fail('test failure'));

                    $rootScope.$digest();
                    $rootScope.$digest();

                    expect(testUnit.isIdling)
                        .toEqual(false);

                    expect(testUnit.isBusy)
                        .toEqual(true);

                    done();
                });

            });

            describe('when promise gets resolved', () => {

                it('should be idling again and not be busy', (done) => {
                    testUnit.track(testPromise)
                        .then(() => {
                            expect(testUnit.isIdling)
                                .toEqual(true);

                            expect(testUnit.isBusy)
                                .toEqual(false);

                            done();
                        })
                        .catch((error) => {
                            done.fail(error);
                        });

                    testDeferred.resolve(testResolveValue);

                    $rootScope.$digest();
                });

            });

            describe('when promise gets rejected', () => {

                it('should be idling again and not be busy', (done) => {
                    testUnit.track(testPromise)
                        .then(() => {
                            done.fail('test failure');
                        })
                        .catch(() => {
                            expect(testUnit.isIdling)
                                .toEqual(true);

                            expect(testUnit.isBusy)
                                .toEqual(false);

                            done();
                        });

                    testDeferred.reject(testRejectReason);

                    $rootScope.$digest();
                });

            });

        });

    });

});
