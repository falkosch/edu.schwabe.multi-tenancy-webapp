import angular from 'angular';

import { IndexModule } from '../../src/index.module';

export const Tenant1Module = angular
    .module('tenant1', [
        IndexModule,
    ])
    .name;
