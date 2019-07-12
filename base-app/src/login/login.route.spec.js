import _ from 'lodash';
import angular from 'angular';
import uiRouter from '@uirouter/angularjs';

import { LoginModule } from './login.module';
import { LoginStateId, loginRoute } from './login.route';

describe(`${LoginModule} route config`, () => {

    let $stateProviderMock;

    let $injector;

    beforeEach(() => {

        angular.mock.module(uiRouter, ($stateProvider) => {
            $stateProviderMock = $stateProvider;
            spyOn($stateProviderMock, 'state');
        });

        angular.mock.module(LoginModule);

        inject((_$injector_) => {
            $injector = _$injector_;
        });

    });

    describe('given architecture', () => {

        const expectedInjects = [
            '$stateProvider',
        ];

        it(`should only depend on ${expectedInjects.join(',')}`, () => {

            expect(_.sortBy($injector.annotate(loginRoute)))
                .toEqual(_.sortBy(expectedInjects));

        });

    });

    it(`should setup state ${LoginStateId}`, () => {

        expect($stateProviderMock.state)
            .toHaveBeenCalledWith(jasmine.objectContaining({
                name: LoginStateId,
            }));

    });

});
