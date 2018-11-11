import angular from 'angular';
import uiRouter from '@uirouter/angularjs';

import { StartModule } from './start.module';
import { StartStateId } from './start.route';

describe(`${StartModule} route config`, () => {

    let $stateProviderMock;

    beforeEach(() => {

        angular.mock.module(uiRouter, ($stateProvider) => {
            $stateProviderMock = $stateProvider;
            spyOn($stateProviderMock, 'state');
        });

        angular.mock.module(StartModule);

        inject();

    });

    it(`should setup state ${StartStateId}`, () => {

        expect($stateProviderMock.state)
            .toHaveBeenCalledWith(jasmine.objectContaining({
                name: StartStateId,
            }));

    });

});
