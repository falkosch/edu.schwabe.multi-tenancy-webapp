export const NG_HIDE = 'ng-hide';

export class BusySpinnerController {

    static $inject = ['$element'];

    /**
     * @param {JQLite} $element
     */
    constructor($element) {
        this.$element = $element;
    }

    $onInit() {
        this.setVisibility(this.busy);
    }

    $onChanges({ busy }) {
        if (busy) {
            const { currentValue, previousValue } = busy;
            if (currentValue !== previousValue) {
                this.setVisibility(currentValue);
            }
        }
    }

    setVisibility(visible) {
        if (visible) {
            this.$element.removeClass(NG_HIDE);
        } else {
            this.$element.addClass(NG_HIDE);
        }
    }
}
