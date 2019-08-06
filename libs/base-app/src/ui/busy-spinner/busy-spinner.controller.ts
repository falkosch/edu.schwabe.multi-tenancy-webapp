export const NG_HIDE = 'ng-hide';

export const BusySpinnerBusyBindingName: keyof BusySpinnerController = 'busy';

export class BusySpinnerController implements angular.IController {

    public static $inject = ['$element'];

    public busy = false;

    public constructor(private $element: angular.IAugmentedJQuery) { }

    public $onInit(): void {
        this.setVisibility(this.busy);
    }

    public $onChanges(onChangesObj: angular.IOnChangesObject): void {
        const { busy } = onChangesObj;
        if (busy) {
            const { currentValue, previousValue } = busy;
            if (currentValue !== previousValue) {
                this.setVisibility(currentValue);
            }
        }
    }

    private setVisibility(visible: boolean): void {
        if (visible) {
            this.$element.removeClass(NG_HIDE);
        } else {
            this.$element.addClass(NG_HIDE);
        }
    }
}
