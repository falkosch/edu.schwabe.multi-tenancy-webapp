import angular from 'angular';
import uiRouter from '@uirouter/angularjs';

import { ProfileModule } from './profile.module';
import { ProfileStateId } from './profile.route';

describe(`${ProfileModule} route config`, () => {

    let $stateProviderMock;

    beforeEach(() => {

        angular.mock.module(uiRouter, ($stateProvider) => {
            $stateProviderMock = $stateProvider;
            spyOn($stateProviderMock, 'state');
        });

        angular.mock.module(ProfileModule);

        inject();

    });

    it(`should setup state ${ProfileStateId}`, () => {

        expect($stateProviderMock.state)
            .toHaveBeenCalledWith(jasmine.objectContaining({
                name: ProfileStateId,
            }));

    });

});
