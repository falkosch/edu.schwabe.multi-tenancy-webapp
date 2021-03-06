import _ from 'lodash';
import angular from 'angular';

import { IndexModule } from './index.module';
import { indexHtml5Config } from './index-html5.config';

describe(`${IndexModule} html5 config`, () => {

    let $locationProviderMock: angular.ILocationProvider;

    let $injector: angular.auto.IInjectorService;

    beforeEach(() => {

        angular.mock.module('ng', (
            _$injector_: angular.auto.IInjectorService,
            $locationProvider: angular.ILocationProvider,
        ) => {
            $injector = _$injector_;

            $locationProviderMock = $locationProvider;
            spyOn($locationProviderMock, 'html5Mode');
        });

        angular.mock.module(IndexModule);

        inject();

    });

    describe('given architecture', () => {

        const expectedInjects = [
            '$locationProvider',
        ];

        it(`should only depend on ${expectedInjects.join(',')}`, () => {
            expect(_.sortBy($injector.annotate(indexHtml5Config)))
                .toEqual(_.sortBy(expectedInjects));
        });

    });

    it('should setup html5Mode', () => {
        expect($locationProviderMock.html5Mode as any)
            .toHaveBeenCalledWith(true);
    });

});
