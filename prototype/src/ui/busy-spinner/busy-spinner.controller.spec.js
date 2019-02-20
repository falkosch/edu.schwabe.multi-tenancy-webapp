import _ from 'lodash';
import angular from 'angular';

import { UiModule } from '../ui.module';
import { NG_HIDE, BusySpinnerController } from './busy-spinner.controller';
import { BusySpinnerComponentName } from './busy-spinner.component';

describe(`${UiModule}.${BusySpinnerComponentName} component controller`, () => {

    let busySpinnerController;
    let mocks;

    function createInjectWithBindings(bindings) {
        return ($componentController) => {
            busySpinnerController = $componentController(BusySpinnerComponentName, mocks, bindings);
        };
    }

    function createChangeObj(newValue, prevValue = !newValue, name = 'busy') {
        return {
            [name]: {
                currentValue: newValue,
                previousValue: prevValue,
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

            inject(createInjectWithBindings(undefined));

            expect(busySpinnerController)
                .toEqual(jasmine.any(BusySpinnerController));

        });

    });

    describe('.setVisibility', () => {

        describe('when visible parameter is falsy', () => {

            it('should only call $element.addClass("ng-hide")', () => {

                inject(createInjectWithBindings(undefined));

                busySpinnerController.setVisibility(false);

                expect(mocks.$element.addClass)
                    .toHaveBeenCalledWith(NG_HIDE);

                expect(mocks.$element.removeClass)
                    .toHaveBeenCalledTimes(0);

            });

        });

        describe('when visible parameter is truthy', () => {

            it('should only call $element.removeClass("ng-hide")', () => {

                inject(createInjectWithBindings(undefined));

                busySpinnerController.setVisibility(true);

                expect(mocks.$element.addClass)
                    .toHaveBeenCalledTimes(0);

                expect(mocks.$element.removeClass)
                    .toHaveBeenCalledWith(NG_HIDE);

            });

        });

    });

    describe('.$onInit()', () => {

        describe('when busy is falsy', () => {

            it(`should only call $element.addClass("${NG_HIDE}")`, () => {

                inject(createInjectWithBindings({ busy: false }));

                busySpinnerController.$onInit();

                expect(mocks.$element.addClass)
                    .toHaveBeenCalledWith(NG_HIDE);

                expect(mocks.$element.removeClass)
                    .toHaveBeenCalledTimes(0);

            });

        });

        describe('when busy is truthy', () => {

            it(`should only call $element.removeClass("${NG_HIDE}")`, () => {

                inject(createInjectWithBindings({ busy: true }));

                busySpinnerController.$onInit();

                expect(mocks.$element.addClass)
                    .toHaveBeenCalledTimes(0);

                expect(mocks.$element.removeClass)
                    .toHaveBeenCalledWith(NG_HIDE);

            });

        });

    });

    describe('.$onChanges({ busy })', () => {

        describe('when "busy" does not change', () => {

            it('should noop ', () => {

                inject(createInjectWithBindings(undefined));

                busySpinnerController.$onChanges(createChangeObj(false, false));
                busySpinnerController.$onChanges(createChangeObj(true, true));

                expect(mocks.$element.addClass)
                    .toHaveBeenCalledTimes(0);

                expect(mocks.$element.removeClass)
                    .toHaveBeenCalledTimes(0);

            });

        });

        describe('when something else changes but not the "busy"', () => {

            it('should noop', () => {

                inject(createInjectWithBindings(undefined));

                busySpinnerController.$onChanges(createChangeObj(false, false, 'other'));
                busySpinnerController.$onChanges(createChangeObj(false, true, 'other'));
                busySpinnerController.$onChanges(createChangeObj(true, false, 'other'));
                busySpinnerController.$onChanges(createChangeObj(true, true, 'other'));

                expect(mocks.$element.addClass)
                    .toHaveBeenCalledTimes(0);

                expect(mocks.$element.removeClass)
                    .toHaveBeenCalledTimes(0);

            });

        });

        describe('when "busy" changes to falsy', () => {

            it(`should only call $element.addClass("${NG_HIDE}")`, () => {

                inject(createInjectWithBindings(undefined));

                busySpinnerController.$onChanges(createChangeObj(false));

                expect(mocks.$element.addClass)
                    .toHaveBeenCalledWith(NG_HIDE);

                expect(mocks.$element.removeClass)
                    .toHaveBeenCalledTimes(0);

            });

        });

        describe('when "busy" changes to truthy', () => {

            it(`should only call $element.removeClass("${NG_HIDE}")`, () => {

                inject(createInjectWithBindings(undefined));

                busySpinnerController.$onChanges(createChangeObj(true));

                expect(mocks.$element.addClass)
                    .toHaveBeenCalledTimes(0);

                expect(mocks.$element.removeClass)
                    .toHaveBeenCalledWith(NG_HIDE);

            });

        });

    });

});
