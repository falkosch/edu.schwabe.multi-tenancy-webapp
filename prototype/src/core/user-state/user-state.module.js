import angular from 'angular';

import { BackendModule } from '../backend/backend.module';
import { AnnotationsModule } from '../annotations/annotations.module';

import { UserStateServiceName, UserStateService } from './user-state.service';
import { EventEmitterModule } from '../event-emitter/event-emitter.module';

export const UserStateModule = angular
    .module('app.core.user-state', [
        BackendModule,
        AnnotationsModule,
        EventEmitterModule,
    ])
    .service(UserStateServiceName, UserStateService)
    .name;
