import _ from 'lodash';
import angular from 'angular';

import { PromiseTrackerModule } from './promise-tracker.module';
import { PromiseTracker } from './promise-tracker.model';

describe(`${PromiseTrackerModule}.models.${PromiseTracker.name}`, () => {

    const testResolveValue = 'TEST';
    const testRejectError = new Error('test');

    let testUnit;

    let $q;
    let $rootScope;

    beforeEach(() => {

        angular.mock.module(PromiseTrackerModule);

        inject((_$q_, _$rootScope_) => {
            $q = _$q_;
            $rootScope = _$rootScope_;

            testUnit = new PromiseTracker();
        });

    });

    describe('.track()', () => {

        it('should accept promises', () => {
            const deferred = $q.defer();
            const { promise } = deferred;

            testUnit.track(promise);

            expect(testUnit.tracked)
                .toContain(promise);
        });

        it('should accept anything but not track it', () => {
            _.forEach(
                [undefined, null, 0, 1, 0.1, '', 'A', String(''), String('A'), [], {}],
                () => {
                    expect(testUnit.tracked)
                        .toEqual([]);
                },
            );
        });

    });

    describe('.isIdling() and .isBusy()', () => {

        let testDeferred;
        let testPromise;

        beforeEach(() => {
            testDeferred = $q.defer();
            testPromise = testDeferred.promise;
        });

        describe('when nothing is tracked', () => {

            it('should be idling and not busy', () => {
                expect(testUnit.isIdling)
                    .toEqual(true);

                expect(testUnit.isBusy)
                    .toEqual(false);
            });

        });

        describe('when a promise is tracked', () => {

            let actualPromise;

            beforeEach(() => {
                actualPromise = testUnit.track(testPromise);
            });

            it('should return a new, wrapped promise', () => {
                expect(actualPromise)
                    .not
                    .toBe(testPromise);
            });

            it('should be not idling and be busy', () => {
                expect(testUnit.isIdling)
                    .toEqual(false);

                expect(testUnit.isBusy)
                    .toEqual(true);
            });

            describe('when tracked promise is not resolved or rejected yet', () => {

                it('should resolve or reject the wrapped promise not yet', (done) => {
                    $rootScope.$digest();

                    actualPromise
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

                beforeEach(() => {
                    testDeferred.resolve(testResolveValue);
                });

                it('should be idling again and not be busy', (done) => {
                    actualPromise
                        .then((actualResolveValue) => {
                            expect(actualResolveValue)
                                .toBe(testResolveValue);

                            expect(testUnit.isIdling)
                                .toEqual(true);

                            expect(testUnit.isBusy)
                                .toEqual(false);

                            done();
                        })
                        .catch((error) => {
                            done.fail(error);
                        });

                    $rootScope.$digest();
                });

            });

            describe('when promise gets rejected', () => {

                beforeEach(() => {
                    testDeferred.reject(testRejectError);
                });

                it('should be idling again and not be busy', (done) => {
                    actualPromise
                        .then(() => {
                            done.fail('test failure');
                        })
                        .catch((error) => {
                            expect(error)
                                .toBe(testRejectError);

                            expect(testUnit.isIdling)
                                .toEqual(true);

                            expect(testUnit.isBusy)
                                .toEqual(false);

                            done();
                        });

                    $rootScope.$digest();
                });

            });

        });

    });

});
