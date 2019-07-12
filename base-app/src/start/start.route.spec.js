import _ from 'lodash';
import angular from 'angular';
import uiRouter from '@uirouter/angularjs';

import { StartModule } from './start.module';
import { StartStateId, startRoute } from './start.route';

describe(`${StartModule} route config`, () => {

    let $stateProviderMock;

    let $injector;

    beforeEach(() => {

        angular.mock.module(uiRouter, ($stateProvider) => {
            $stateProviderMock = $stateProvider;
            spyOn($stateProviderMock, 'state');
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

        expect($stateProviderMock.state)
            .toHaveBeenCalledWith(jasmine.objectContaining({
                name: StartStateId,
            }));

    });

});
