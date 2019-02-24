import angular from 'angular';

import { BackendModule } from './backend/backend.module';
import { MockBackendModule } from './mock-backend/mock-backend.module';

import { StateAccessControlModule } from './state-access-control/state-access-control.module';
import { EventEmitterModule } from './event-emitter/event-emitter.module';
import { LanguageModule } from './language/language.module';
import { NavigationModule } from './navigation/navigation.module';
import { PromiseTrackerModule } from './promise-tracker/promise-tracker.module';
import { UserStateModule } from './user-state/user-state.module';

export const CoreModule = angular
    .module('app.core', [
        BackendModule,
        MockBackendModule,

        StateAccessControlModule,
        EventEmitterModule,
        LanguageModule,
        NavigationModule,
        PromiseTrackerModule,
        UserStateModule,
    ])
    .name;
