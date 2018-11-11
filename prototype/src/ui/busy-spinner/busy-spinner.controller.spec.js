import { UiModule } from '../ui.module';
import { BusySpinnerController } from './busy-spinner.controller';
import { BusySpinnerName } from './busy-spinner.component';

describe(`${UiModule}.${BusySpinnerName} component controller`, () => {

    const NgHide = 'ng-hide';

    let busySpinnerController;
    let mocks;

    function createInjectWithBindings(bindings) {
        return ($componentController) => {
            busySpinnerController = $componentController(BusySpinnerName, mocks, bindings);
        };
    }

    function busyChangeObj(newBusy, prevBusy) {
        return {
            busy: {
                currentValue: newBusy,
                previousValue: (arguments.length === 1) ? !newBusy : prevBusy,
            },
        };
    }

    beforeEach(() => {

        angular.mock.module(UiModule);

        mocks = {
            $element: jasmine.createSpyObj('$element', ['addClass', 'removeClass'])
        };

    });

    it(`should be an instanceof ${BusySpinnerName} component controller`, () => {

        inject(createInjectWithBindings(undefined));

        expect(busySpinnerController)
            .toEqual(jasmine.any(BusySpinnerController));

    });

    describe('.setVisibility', () => {

        it('should only call $element.addClass("ng-hide") when visible parameter is falsy', () => {

            inject(createInjectWithBindings(undefined));

            busySpinnerController.setVisibility(false);

            expect(mocks.$element.addClass)
                .toHaveBeenCalledWith(NgHide);

            expect(mocks.$element.removeClass)
                .toHaveBeenCalledTimes(0);

        });

        it('should only call $element.removeClass("ng-hide") when visible parameter is truthy', () => {

            inject(createInjectWithBindings(undefined));

            busySpinnerController.setVisibility(true);

            expect(mocks.$element.addClass)
                .toHaveBeenCalledTimes(0);

            expect(mocks.$element.removeClass)
                .toHaveBeenCalledWith(NgHide);

        });

    });

    describe('.$onInit', () => {

        it('should only call $element.addClass("ng-hide") when busy is falsy', () => {

            inject(createInjectWithBindings({ busy: false }));

            busySpinnerController.$onInit();

            expect(mocks.$element.addClass)
                .toHaveBeenCalledWith(NgHide);

            expect(mocks.$element.removeClass)
                .toHaveBeenCalledTimes(0);

        });

        it('should only call $element.removeClass("ng-hide") when busy is truthy', () => {

            inject(createInjectWithBindings({ busy: true }));

            busySpinnerController.$onInit();

            expect(mocks.$element.addClass)
                .toHaveBeenCalledTimes(0);

            expect(mocks.$element.removeClass)
                .toHaveBeenCalledWith(NgHide);

        });

    });

    describe('.$onChanges', () => {

        it('should noop when busy does not change', () => {

            inject(createInjectWithBindings(undefined));

            busySpinnerController.$onChanges(busyChangeObj(false, false));
            busySpinnerController.$onChanges(busyChangeObj(true, true));

            expect(mocks.$element.addClass)
                .toHaveBeenCalledTimes(0);

            expect(mocks.$element.removeClass)
                .toHaveBeenCalledTimes(0);

        });

        it('should only call $element.addClass("ng-hide") when busy changes to falsy', () => {

            inject(createInjectWithBindings(undefined));

            busySpinnerController.$onChanges(busyChangeObj(false));

            expect(mocks.$element.addClass)
                .toHaveBeenCalledWith(NgHide);

            expect(mocks.$element.removeClass)
                .toHaveBeenCalledTimes(0);

        });

        it('should only call $element.removeClass("ng-hide") when busy changes to truthy', () => {

            inject(createInjectWithBindings(undefined));

            busySpinnerController.$onChanges(busyChangeObj(true));

            expect(mocks.$element.addClass)
                .toHaveBeenCalledTimes(0);

            expect(mocks.$element.removeClass)
                .toHaveBeenCalledWith(NgHide);

        });

    });

});
