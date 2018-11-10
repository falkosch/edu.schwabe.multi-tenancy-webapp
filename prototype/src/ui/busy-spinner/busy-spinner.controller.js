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

    $onChanges(changesObj) {
        const { busy } = changesObj;
        if (busy) {
            const { currentValue, previousValue } = busy;
            if (currentValue !== previousValue) {
                this.setVisibility(currentValue);
            }
        }
    }

    setVisibility(visible) {
        if (visible) {
            this.$element.removeClass('ng-hide');
        } else {
            this.$element.addClass('ng-hide');
        }
    }
}
