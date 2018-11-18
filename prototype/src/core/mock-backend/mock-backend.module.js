import angular from 'angular';

import { BackendModule } from '../backend/backend.module';

import { MockAuthenticationServiceName, MockAuthenticationService } from './mock-authentication.service';
import { MockProfileServiceName, MockProfileService } from './mock-profile.service';
import { MockProfilesUrlName, MockProfilesUrl } from './mock-profiles-url.constant';

export const MockBackendModule = angular
    .module('app.core.mock-backend', [
        BackendModule,
    ])
    .constant(MockProfilesUrlName, MockProfilesUrl)
    .service(MockAuthenticationServiceName, MockAuthenticationService)
    .service(MockProfileServiceName, MockProfileService)
    .name;
