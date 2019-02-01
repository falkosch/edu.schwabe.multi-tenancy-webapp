import angular from 'angular';

import { UserStateServiceName, UserStateService } from './user-state.service';
import { UserStateModule } from './user-state.module';

describe(`${UserStateModule}.${UserStateServiceName}`, () => {

    let userStateService;

    beforeEach(() => {

        angular.mock.module(UserStateModule);

        inject((_userStateService_) => {
            userStateService = _userStateService_;
        });

    });

    it(`should be an instanceof ${UserStateServiceName}`, () => {

        expect(userStateService)
            .toEqual(jasmine.any(UserStateService));

    });

});
