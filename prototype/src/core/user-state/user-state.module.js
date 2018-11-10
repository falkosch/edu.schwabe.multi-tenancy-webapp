import angular from 'angular';

import { BackendModule } from '../backend/backend.module';

export const UserStateModule = angular
    .module('app.core.user-state', [
        BackendModule,
    ])
    .name;
