import angular from 'angular';
import uiRouter from '@uirouter/angularjs';

import { AppModule } from './app.module';
import { AppStateId } from './app.route';

describe(`${AppModule} route config`, () => {

    let $stateProviderMock;

    beforeEach(() => {

        angular.mock.module(uiRouter, ($stateProvider) => {
            $stateProviderMock = $stateProvider;
            spyOn($stateProviderMock, 'state');
        });

        angular.mock.module(AppModule);

        /*
         * An inject() call is required to trigger execution of the module callback for
         * angular.mock.module(...).
         */
        inject();

    });

    it(`should setup state ${AppStateId}`, () => {

        expect($stateProviderMock.state)
            .toHaveBeenCalledWith(jasmine.objectContaining({
                name: AppStateId,
            }));

    });

});
