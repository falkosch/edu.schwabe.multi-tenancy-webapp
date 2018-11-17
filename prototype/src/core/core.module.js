import angular from 'angular';

import { BackendModule } from './backend/backend.module';
import { MockBackendModule } from './mock-backend/mock-backend.module';

import { PromiseTrackerModule } from './promise-tracker/promise-tracker.module';
import { UserStateModule } from './user-state/user-state.module';
import { EventEmitterModule } from './event-emitter/event-emitter.module';
import { AccessControlModule } from './access-control/access-control.module';

export const CoreModule = angular
    .module('app.core', [
        BackendModule,
        MockBackendModule,

        AccessControlModule,
        PromiseTrackerModule,
        EventEmitterModule,
        UserStateModule,
    ])
    .name;
