import angular from 'angular';

import { IndexModule } from '../../src/index.module';

export const Tenant2Module = angular
    .module('tenant2', [
        IndexModule,
    ])
    .name;
