import angular from 'angular';

import { IndexModule, registerAppServiceWorkerRuntime } from './index.module';

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

    it('should be able to register a runtime for the app\'s service worker', () => {
        const runtimeImportMock = {
            default: {
                register: jasmine.createSpy('register'),
            },
        };

        registerAppServiceWorkerRuntime(runtimeImportMock);

        expect(runtimeImportMock.default.register)
            .toHaveBeenCalledWith();
    });

});
