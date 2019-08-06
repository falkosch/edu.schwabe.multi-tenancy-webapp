import angular from 'angular';

import '@edu.schwabe.webapp-prototypes/base-service-worker/src/index.module.ts';

import './tenant1.scss';

import { IndexModule } from '@edu.schwabe.webapp-prototypes/angularjs-base-app/src/index.module';

export const Tenant1Module = angular
    .module('tenant1', [
        IndexModule,
    ])
    .name;
