import angular from 'angular';

import { Tenant1Module } from './tenant1.module';

describe(`${Tenant1Module} run`, () => {

    it('should be loaded', () => {

        let loaded = false;

        angular.mock.module(Tenant1Module, () => {
            loaded = true;
        });

        inject();

        expect(loaded)
            .toBeTruthy();

    });

});
