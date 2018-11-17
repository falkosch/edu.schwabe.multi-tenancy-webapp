import angular from 'angular';

import { AccessControlModule } from './access-control.module';
import { AccessControlServiceName, AccessControlService } from './access-control.service';

describe(`${AccessControlModule}.${AccessControlServiceName}`, () => {

    let accessControlService;

    beforeEach(() => {

        angular.mock.module(AccessControlModule);

        inject((_accessControlService_) => {
            accessControlService = _accessControlService_;
        });

    });

    it(`should be an instanceof ${AccessControlServiceName}`, () => {

        expect(accessControlService)
            .toEqual(jasmine.any(AccessControlService));

    });

});
