import angular from 'angular';

import { IndexModule } from './index.module';

describe(`${IndexModule} html5 config`, () => {

    let $locationProviderMock;

    beforeEach(() => {

        /*
         * We initialize another module with a load-callback, so that we can access the one
         * provider that we need to spy on or mock. That can't be done with the module under
         * test.
         */
        angular.mock.module('ng', ($locationProvider) => {
            $locationProviderMock = $locationProvider;
            spyOn($locationProviderMock, 'html5Mode');
        });

        angular.mock.module(IndexModule);

        /*
         * Calling inject() is required to trigger execution of the module callback for
         * angular.mock.module(...).
         */
        inject();

    });

    it('should setup html5Mode', () => {

        expect($locationProviderMock.html5Mode)
            .toHaveBeenCalledWith(true);

    });

});
