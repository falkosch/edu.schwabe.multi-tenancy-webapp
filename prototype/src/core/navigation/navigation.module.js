import angular from 'angular';

import { NavigationServiceName, NavigationService } from './navigation.service';

export const NavigationModule = angular
    .module('app.core.navigation', [])
    .service(NavigationServiceName, NavigationService)
    .name;
