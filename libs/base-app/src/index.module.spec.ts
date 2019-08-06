import angular from 'angular';

import { IndexModule } from './index.module';

describe(`${IndexModule} architecture`, () => {

    it('should initialize without dependency or inject issues', () => {

        let passedProvidingPhase = false;
        let passedRunPhase = false;

        angular.mock.module(IndexModule, () => {
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
