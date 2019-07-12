import { BusySpinnerController } from './busy-spinner.controller';

import './busy-spinner.component.scss';
import templateUrl from './busy-spinner.template.html';

export const BusySpinnerComponentName = 'appBusySpinner';

export const BusySpinnerComponent = {
    controller: BusySpinnerController,
    templateUrl,
    bindings: {
        busy: '<?',
    },
};
