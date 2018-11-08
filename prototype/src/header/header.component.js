import { HeaderController } from './header.controller';

import './header.component.scss';
import templateUrl from './header.template.html';

export const HeaderName = 'appHeader';

export const HeaderComponent = {
    controller: HeaderController,
    templateUrl,
};