import _ from 'lodash';
import angular from 'angular';

import { CoreModule } from './core.module';
import { BackendModule } from './backend/backend.module';
import { MockBackendModule } from './mock-backend/mock-backend.module';

describe(`${CoreModule} architecture`, () => {

    it(`should have ${BackendModule} before ${MockBackendModule} in requires list`, () => {

        const { requires } = angular.module(CoreModule);

        expect(_.indexOf(requires, BackendModule))
            .toBeLessThan(_.indexOf(requires, MockBackendModule));

    });

});
