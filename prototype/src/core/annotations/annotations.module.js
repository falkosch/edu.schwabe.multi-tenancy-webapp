import angular from 'angular';

import { InjectionServiceName, InjectionService } from './injection.service';

export const AnnotationsModule = angular
    .module('app.core.annotations', [
    ])
    .service(InjectionServiceName, InjectionService)
    .name;
