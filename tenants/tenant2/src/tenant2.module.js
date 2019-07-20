import angular from 'angular';

import '@edu.schwabe.webapp-prototypes/base-service-worker/src/index.module.ts';

import './tenant2.scss';

import { IndexModule } from '@edu.schwabe.webapp-prototypes/angularjs-base-app/src/index.module';

export const Tenant2Module = angular
    .module('tenant2', [
        IndexModule,
    ])
    .name;
