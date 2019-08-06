import _ from 'lodash';
import angular from 'angular';
import uiRouter, { StateProvider } from '@uirouter/angularjs';

import { StartModule } from './start.module';
import { StartStateId, startRoute } from './start.route';

describe(`${StartModule} route config`, () => {

    let $stateProviderSpied: StateProvider;

    let $injector: angular.auto.IInjectorService;

    beforeEach(() => {

        angular.mock.module(uiRouter, ($stateProvider: StateProvider) => {
            $stateProviderSpied = $stateProvider;
            spyOn($stateProviderSpied, 'state');
        });

        angular.mock.module(StartModule);

        inject((_$injector_) => {
            $injector = _$injector_;
        });

    });

    describe('given architecture', () => {

        const expectedInjects = [
            '$stateProvider',
        ];

        it(`should only depend on ${expectedInjects.join(',')}`, () => {

            expect(_.sortBy($injector.annotate(startRoute)))
                .toEqual(_.sortBy(expectedInjects));

        });

    });

    it(`should setup state ${StartStateId}`, () => {

        expect($stateProviderSpied.state)
            .toHaveBeenCalledWith(jasmine.objectContaining({
                name: StartStateId,
            }));

    });

});
