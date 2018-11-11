import angular from 'angular';

import { AppModule } from './app.module';

describe(`${AppModule} html5 config`, () => {

    let $locationProviderMock;

    beforeEach(() => {

        angular.mock.module('ng', ($locationProvider) => {
            $locationProviderMock = $locationProvider;
            spyOn($locationProviderMock, 'html5Mode');
        });

        angular.mock.module(AppModule);

        /*
         * An inject() call is required to trigger execution of the module callback for
         * angular.mock.module(...).
         */
        inject();

    });

    it('should setup html5Mode', () => {

        expect($locationProviderMock.html5Mode)
            .toHaveBeenCalledWith(true);

    });

});
