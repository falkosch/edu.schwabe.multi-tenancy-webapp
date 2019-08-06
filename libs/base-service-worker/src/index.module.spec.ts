import { registerAppServiceWorkerRuntime } from './index.module';

describe('base service worker module', () => {

    it('should register the runtime for the service worker', () => {
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
