import angular from 'angular';
import { AuthenticationServiceName, AuthenticationService } from './authentication.service';

export const BackendModule = angular
    .module('app.core.backend', [
    ])
    .service(AuthenticationServiceName, AuthenticationService)
    .name;
