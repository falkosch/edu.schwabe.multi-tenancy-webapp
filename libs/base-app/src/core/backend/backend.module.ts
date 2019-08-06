import angular from 'angular';

import { AuthenticationServiceName, AuthenticationService } from './authentication.service';
import { ProfileServiceName, ProfileService } from './profile.service';

export const BackendModule = angular
    .module('app.core.backend', [
    ])
    .service(AuthenticationServiceName, AuthenticationService)
    .service(ProfileServiceName, ProfileService)
    .name;
