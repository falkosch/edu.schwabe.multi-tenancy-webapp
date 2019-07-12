import { LoginController } from './login.controller';

import './login.component.scss';
import templateUrl from './login.template.html';

export const LoginComponentName = 'appLogin';

export const LoginComponent = {
    controller: LoginController,
    templateUrl,
};
