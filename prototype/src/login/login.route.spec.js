import angular from 'angular';
import uiRouter from '@uirouter/angularjs';

import { LoginModule } from './login.module';
import { LoginStateId } from './login.route';

describe(`${LoginModule} route config`, () => {

    let $stateProviderMock;

    beforeEach(() => {

        angular.mock.module(uiRouter, ($stateProvider) => {
            $stateProviderMock = $stateProvider;
            spyOn($stateProviderMock, 'state');
        });

        angular.mock.module(LoginModule);

        inject();

    });

    it(`should setup state ${LoginStateId}`, () => {

        expect($stateProviderMock.state)
            .toHaveBeenCalledWith(jasmine.objectContaining({
                name: LoginStateId,
            }));

    });

});
