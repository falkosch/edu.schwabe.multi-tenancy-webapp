import { expect } from 'chai';

import { NavServiceName, NavService } from './nav.service';
import { NavModule } from './nav.module';

describe(`${NavModule}.${NavServiceName}`, () => {

    let navService;

    beforeEach(() => {
        angular.mock.module(NavModule);

        // mock the service
        inject((_navService_) => {
            navService = _navService_;
        });
    });

    it(`should be an instanceof ${NavServiceName}`, () => {
        expect(navService).to.be.an.instanceof(NavService);
    });

});
