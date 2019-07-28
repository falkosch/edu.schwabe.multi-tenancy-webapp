import angular from 'angular';

import { EventEmitterModule } from '../event-emitter/event-emitter.module';

export const ViewModelsModule = angular
    .module('app.core.view-models', [
        EventEmitterModule,
    ])
    .name;
