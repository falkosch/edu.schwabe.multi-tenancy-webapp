import _ from 'lodash';
import angular from 'angular';
import uiRouter from '@uirouter/angularjs';

import { StateAccessControlModule } from './state-access-control.module';
import { stateAccessControlDecoratorConfig, StateAccessControlProperty, stateAccessControlDecorator } from './state-access-control-decorator.config';

describe(`${StateAccessControlModule} state decorator config`, () => {

    let $stateProviderSpied;

    let $injector;

    beforeEach(() => {

        angular.mock.module(uiRouter, ($stateProvider) => {
            $stateProviderSpied = $stateProvider;
            spyOn($stateProvider, 'decorator');
        });

        angular.mock.module(StateAccessControlModule);

        inject((_$injector_) => {
            $injector = _$injector_;
        });

    });

    describe('given architecture', () => {

        const expectedInjects = [
            '$stateProvider',
        ];

        it(`should only depend on ${expectedInjects.join(',')}`, () => {
            expect(_.sortBy($injector.annotate(stateAccessControlDecoratorConfig)))
                .toEqual(_.sortBy(expectedInjects));
        });

    });

    it('should decorate the accessControl property for states', () => {
        expect($stateProviderSpied.decorator)
            .toHaveBeenCalledWith(StateAccessControlProperty, jasmine.any(Function));
    });

    describe('accessControlStateDecorator', () => {

        describe(`when ${StateAccessControlProperty} is already present on the state`, () => {
            const testState = {
                [StateAccessControlProperty]: {
                    test: 'test',
                },
            };

            it('should return that already annotated data', () => {
                expect(stateAccessControlDecorator(testState))
                    .toBe(testState[StateAccessControlProperty]);
            });

        });

        describe(`when ${StateAccessControlProperty} is NOT present on the state`, () => {
            const testState = {
                test: 'test',
            };

            it('should return an empty object instead', () => {
                expect(stateAccessControlDecorator(testState))
                    .toEqual({});
            });

        });

    });

});
