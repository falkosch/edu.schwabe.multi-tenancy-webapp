import _ from 'lodash';
import angular from 'angular';

import { ProfileModule } from './profile.module';
import { ProfileController, ProfileViewBindingName } from './profile.controller';
import { ProfileComponentName } from './profile.component';
import { GlobalSpinnerServiceName, GlobalSpinnerService } from '../ui/global-spinner/global-spinner.service';
import { ProfileView } from './models/profile-view.model';

describe(`${ProfileModule}.${ProfileComponentName} controller`, () => {

    let testUnit: ProfileController;

    let injects: Record<string, any>;
    let globalSpinnerServiceMock: GlobalSpinnerService;

    let bindings: Record<string, any>;
    let viewMock: ProfileView;

    let $injector: angular.auto.IInjectorService;
    let $rootScope: angular.IRootScopeService;

    beforeEach(() => {

        globalSpinnerServiceMock = {
            spinWhilePromise: jasmine.createSpy()
                .and.callFake(_.identity),
        } as any;

        injects = {
            [GlobalSpinnerServiceName]: globalSpinnerServiceMock,
        };

        viewMock = {
            save: jasmine.createSpy('save'),
        } as any;

        bindings = {
            [ProfileViewBindingName]: viewMock,
        };

        angular.mock.module(ProfileModule);

        inject(($componentController, _$injector_, _$rootScope_) => {
            $injector = _$injector_;
            $rootScope = _$rootScope_;

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

        const testStringControlNames = ['', 'a', String('b')];

        it('should mark control as enabled', () => {
            _.forEach(testStringControlNames, (v) => {
                testUnit.enableControl(v);

                expect(testUnit.isEnabled(v))
                    .toBe(true);
            });
        });

        describe('when control is already enabled', () => {

            beforeEach(() => {
                _.forEach(testStringControlNames, (v) => {
                    testUnit.enableControl(v);
                });
            });

            it('should change enabled state of control when it is tried to enable once again', () => {
                _.forEach(testStringControlNames, (v) => {
                    expect(testUnit.isEnabled(v))
                        .toBe(true);

                    testUnit.enableControl(v);

                    expect(testUnit.isEnabled(v))
                        .toBe(true);
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
                    expect(viewMock.save)
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
