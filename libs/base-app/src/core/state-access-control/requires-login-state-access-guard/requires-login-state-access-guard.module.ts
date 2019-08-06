import angular from 'angular';
import uiRouter from '@uirouter/angularjs';

import { UserStateModule } from '../../user-state/user-state.module';

import { RequiresLoginStateAccessGuardServiceName, RequiresLoginStateAccessGuardService } from './requires-login-state-access-guard.service';

export const RequiresLoginStateAccessGuardModule = angular
    .module('app.core.state-access-control.requires-login-state-access-guard', [
        uiRouter,
        UserStateModule,
    ])
    .service(RequiresLoginStateAccessGuardServiceName, RequiresLoginStateAccessGuardService)
    .name;
