import angular from 'angular';
import uiRouter from '@uirouter/angularjs';

import { accessControlStateDecoratorConfig } from './access-control.config';

import { AccessControlServiceName, AccessControlService } from './access-control.service';

import { accessControlUiRouterTransitionsRun } from './access-control-ui-router-transitions.run';
import { RequireLoginAccessControlServiceName, RequireLoginAccessControlService } from './require-login-access-control.service';

export const AccessControlModule = angular
    .module('app.core.access-control', [
        uiRouter,
    ])
    .config(accessControlStateDecoratorConfig)
    .service(AccessControlServiceName, AccessControlService)
    .service(RequireLoginAccessControlServiceName, RequireLoginAccessControlService)
    .run(accessControlUiRouterTransitionsRun)
    .name;
