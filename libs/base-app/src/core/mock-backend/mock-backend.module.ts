import angular from 'angular';

import { BackendModule } from '../backend/backend.module';

import { MockAuthenticationServiceName, MockAuthenticationService } from './mock-authentication.service';
import { MockProfileServiceName, MockProfileService } from './mock-profile.service';

export const MockBackendModule = angular
    .module('app.core.mock-backend', [
        BackendModule,
    ])
    .service(MockAuthenticationServiceName, MockAuthenticationService)
    .service(MockProfileServiceName, MockProfileService)
    .name;
