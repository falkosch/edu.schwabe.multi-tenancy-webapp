import _ from 'lodash';
import angular from 'angular';

import { ProfileModule } from './profile.module';
import { ProfileController } from './profile.controller';
import { ProfileComponentName } from './profile.component';
import { GlobalSpinnerServiceName } from '../ui/global-spinner/global-spinner.service';

describe(`${ProfileModule}.${ProfileComponentName} controller`, () => {

    let testUnit;

    let injects;
    let globalSpinnerServiceMock;

    let bindings;
    let viewmodelMock;

    let $injector;
    let $rootScope;

    beforeEach(() => {

        globalSpinnerServiceMock = {
            spinWhilePromise: jasmine.createSpy(),
        };

        injects = {
            [GlobalSpinnerServiceName]: globalSpinnerServiceMock,
        };

        viewmodelMock = {
            save: jasmine.createSpy('save'),
        };

        bindings = {
            viewmodel: viewmodelMock,
        };

        angular.mock.module(ProfileModule);

        inject(($componentController, _$injector_, _$rootScope_) => {
            $injector = _$injector_;
            $rootScope = _$rootScope_;

            globalSpinnerServiceMock.spinWhilePromise.and.callFake(promise => promise);

            testUnit = $componentController(ProfileComponentName, injects, bindings);
        });

    });

    describe('given architecture', () => {

        const expectedInjects = [
            '$q',
            GlobalSpinnerServiceName,
        ];

        it(`should only depend on ${expectedInjects.join(',')}`, () => {
            expect(_.sortBy($injector.annotate(ProfileController)))
                .toEqual(_.sortBy(expectedInjects));
        });

        it(`should be an instance of ${ProfileController.name}`, () => {
            expect(testUnit)
                .toEqual(jasmine.any(ProfileController));
        });

    });

    describe('.enableControl(controlName)', () => {

        describe('when controlName is NOT a string', () => {

            const testNonStringControlNames = [
                undefined,
                null,
                false,
                true,
                0,
                1,
                0.1,
                Infinity,
                NaN,
                [],
                {},
            ];

            it('should return true to confirm that the control is marked as enabled', () => {
                _.forEach(testNonStringControlNames, (v) => {
                    expect(testUnit.enableControl(v))
                        .toBe(false);
                });
            });

        });

        describe('when controlName is a string', () => {

            const testStringControlNames = ['', 'a', String('b')];

            it('should return true to confirm that the control is marked as enabled', () => {
                _.forEach(testStringControlNames, (v) => {
                    expect(testUnit.enableControl(v))
                        .toBe(true);
                });
            });

            describe('when control is already enabled', () => {

                beforeEach(() => {
                    _.forEach(testStringControlNames, (v) => {
                        testUnit.enableControl(v);
                    });
                });

                it('should return true', () => {
                    _.forEach(testStringControlNames, (v) => {
                        expect(testUnit.enableControl(v))
                            .toBe(true);
                    });
                });

            });

        });

    });

    describe('.isEnabled(controlName)', () => {

        const testNotEnabledControl = 'not enabled control';

        describe('when control is not enabled yet', () => {

            it('should return false', () => {
                expect(testUnit.isEnabled(testNotEnabledControl))
                    .toBe(false);
            });

        });

        describe('when control is enabled', () => {

            const testEnabledControl = 'enabled control';

            beforeEach(() => {
                testUnit.enableControl(testEnabledControl);
            });

            it('should return true for the enabled control', () => {
                expect(testUnit.isEnabled(testEnabledControl))
                    .toBe(true);
            });

            it('should return false for other not enabled controls', () => {
                expect(testUnit.isEnabled(testNotEnabledControl))
                    .toBe(false);
            });

        });

    });

    describe('.submit()', () => {

        it('should save changes in the viewmodel', (done) => {
            testUnit.submit()
                .then(() => {
                    expect(viewmodelMock.save)
                        .toHaveBeenCalledTimes(1);

                    done();
                })
                .catch((error) => {
                    done.fail(error);
                });

            $rootScope.$digest();
        });

    });

});
