import angular from 'angular';
import uiRouter from '@uirouter/angularjs';

import { RequiresLoginStateAccessGuardModule } from './requires-login-state-access-guard/requires-login-state-access-guard.module';

import { stateAccessControlDecoratorConfig } from './state-access-control-decorator.config';
import { stateAccessControlUiRouterTransitionsRun } from './state-access-control-ui-router-transitions.run';

import { StateAccessControlServiceName, StateAccessControlService } from './state-access-control.service';

export const StateAccessControlModule = angular
    .module('app.core.state-access-control', [
        uiRouter,
        RequiresLoginStateAccessGuardModule,
    ])
    .config(stateAccessControlDecoratorConfig)
    .service(StateAccessControlServiceName, StateAccessControlService)
    .run(stateAccessControlUiRouterTransitionsRun)
    .name;
