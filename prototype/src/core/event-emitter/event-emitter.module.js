import angular from 'angular';

import { EventEmitterServiceName, EventEmitterService } from './event-emitter.service';

export const EventEmitterModule = angular
    .module('app.core.event-emitter', [])
    .service(EventEmitterServiceName, EventEmitterService)
    .name;
