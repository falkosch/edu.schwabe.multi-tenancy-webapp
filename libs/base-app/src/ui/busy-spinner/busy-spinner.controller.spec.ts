import _ from 'lodash';
import angular from 'angular';

import { UiModule } from '../ui.module';
import { NG_HIDE, BusySpinnerController, BusySpinnerBusyBindingName } from './busy-spinner.controller';
import { BusySpinnerComponentName } from './busy-spinner.component';

describe(`${UiModule}.${BusySpinnerComponentName} controller`, () => {

    let testUnit: BusySpinnerController;

    let mocks: Record<string, any>;

    function createInjectWithBindings(
        bindings?: Partial<Record<keyof BusySpinnerController, any>>,
    ): (__: angular.IComponentControllerService) => void {

        return ($componentController: angular.IComponentControllerService) => {
            testUnit = $componentController(BusySpinnerComponentName, mocks, bindings);
        };
    }

    function createOnChangesObj(
        newValue: boolean,
        prevValue = !newValue,
        name = BusySpinnerBusyBindingName,
    ): angular.IOnChangesObject {
        return {
            [name]: {
                currentValue: newValue,
                previousValue: prevValue,
                isFirstChange: _.constant(false),
            },
        };
    }

    beforeEach(() => {

        angular.mock.module(UiModule);

        mocks = {
            $element: jasmine.createSpyObj('$element', ['addClass', 'removeClass']),
        };

    });

    describe('given architecture', () => {

        const expectedInjects = [
            '$element',
        ];

        it(`should only depend on ${expectedInjects.join(',')}`, () => {

            inject(($injector) => {

                expect(_.sortBy($injector.annotate(BusySpinnerController)))
                    .toEqual(_.sortBy(expectedInjects));

            });

        });

        it(`should be an instanceof ${BusySpinnerController.name}`, () => {

            inject(createInjectWithBindings());

            expect(testUnit)
                .toEqual(jasmine.any(BusySpinnerController));

        });

    });

    describe('.$onInit()', () => {

        describe(`when ${BusySpinnerBusyBindingName} is falsy`, () => {

            it(`should only call $element.addClass("${NG_HIDE}")`, () => {

                inject(createInjectWithBindings({ [BusySpinnerBusyBindingName]: false }));

                testUnit.$onInit();

                expect(mocks.$element.addClass)
                    .toHaveBeenCalledWith(NG_HIDE);

                expect(mocks.$element.removeClass)
                    .toHaveBeenCalledTimes(0);

            });

        });

        describe(`when ${BusySpinnerBusyBindingName} is truthy`, () => {

            it(`should only call $element.removeClass("${NG_HIDE}")`, () => {

                inject(createInjectWithBindings({ [BusySpinnerBusyBindingName]: true }));

                testUnit.$onInit();

                expect(mocks.$element.addClass)
                    .toHaveBeenCalledTimes(0);

                expect(mocks.$element.removeClass)
                    .toHaveBeenCalledWith(NG_HIDE);

            });

        });

    });

    describe(`.$onChanges({ ${BusySpinnerBusyBindingName} })`, () => {

        describe(`when ${BusySpinnerBusyBindingName} does not change`, () => {

            it('should noop', () => {

                inject(createInjectWithBindings());

                testUnit.$onChanges(createOnChangesObj(false, false));
                testUnit.$onChanges(createOnChangesObj(true, true));

                expect(mocks.$element.addClass)
                    .toHaveBeenCalledTimes(0);

                expect(mocks.$element.removeClass)
                    .toHaveBeenCalledTimes(0);

            });

        });

        describe(`when ${BusySpinnerBusyBindingName} changes to falsy`, () => {

            it(`should only call $element.addClass("${NG_HIDE}")`, () => {

                inject(createInjectWithBindings());

                testUnit.$onChanges(createOnChangesObj(false));

                expect(mocks.$element.addClass)
                    .toHaveBeenCalledWith(NG_HIDE);

                expect(mocks.$element.removeClass)
                    .toHaveBeenCalledTimes(0);

            });

        });

        describe(`when ${BusySpinnerBusyBindingName} changes to truthy`, () => {

            it(`should only call $element.removeClass("${NG_HIDE}")`, () => {

                inject(createInjectWithBindings());

                testUnit.$onChanges(createOnChangesObj(true));

                expect(mocks.$element.addClass)
                    .toHaveBeenCalledTimes(0);

                expect(mocks.$element.removeClass)
                    .toHaveBeenCalledWith(NG_HIDE);

            });

        });

    });

});
