import _ from 'lodash';
import angular from 'angular';

import { IndexModule } from '@edu.schwabe.webapp-prototypes/angularjs-base-app/src/index.module';
import { Tenant1Module } from './tenant1.module';

describe(`${Tenant1Module} architecture`, () => {

    it(`should depend on ${IndexModule}`, () => {
        expect(
            _.includes(angular.module(Tenant1Module).requires, IndexModule),
        ).toBe(true);
    });

    it('should initialize without dependency or inject issues', () => {

        let passedProvidingPhase = false;
        let passedRunPhase = false;

        angular.mock.module(Tenant1Module, () => {
            passedProvidingPhase = true;
        });

        inject(() => {
            passedRunPhase = true;
        });

        expect(passedProvidingPhase)
            .toBe(true);

        expect(passedRunPhase)
            .toBe(true);

    });

});
