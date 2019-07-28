import angular from 'angular';
import 'rx-angular';

import { EventEmitterServiceName, EventEmitterService } from './event-emitter.service';

export const EventEmitterModule = angular
    .module('app.core.event-emitter', [
        'rx',
    ])
    .service(EventEmitterServiceName, EventEmitterService)
    .name;
