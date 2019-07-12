import angular from 'angular';

import './tenant1.scss';

import { IndexModule } from '@edu.schwabe.webapp-prototypes/angularjs-base-app/src/index.module';

export const Tenant1Module = angular
    .module('tenant1', [
        IndexModule,
    ])
    .name;
