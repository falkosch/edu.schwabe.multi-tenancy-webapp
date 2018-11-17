import angular from 'angular';

import { AccessControlModule } from './access-control.module';

import { RequireLoginAccessControlServiceName, RequireLoginAccessControlService } from './require-login-access-control.service';

describe(`${AccessControlModule}.${RequireLoginAccessControlServiceName}`, () => {

    let requireLoginAccessControlService;

    beforeEach(() => {

        angular.mock.module(AccessControlModule);

        inject((_requireLoginAccessControlService_) => {
            requireLoginAccessControlService = _requireLoginAccessControlService_;
        });

    });

    it(`should be an instanceof ${RequireLoginAccessControlServiceName}`, () => {

        expect(requireLoginAccessControlService)
            .toEqual(jasmine.any(RequireLoginAccessControlService));

    });

});
