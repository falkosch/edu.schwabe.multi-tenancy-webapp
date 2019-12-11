import angular from 'angular';

import '@edu.schwabe.multi-tenancy-webapp/base-service-worker/src/index.module.ts';

import './tenant2.scss';

import { IndexModule } from '@edu.schwabe.multi-tenancy-webapp/angularjs-base-app/src/index.module';

export const Tenant2Module = angular
    .module('tenant2', [
        IndexModule,
    ])
    .name;
