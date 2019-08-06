import { BackendErrors } from './backend-errors';
import { BackendModule } from './backend.module';

describe(`${BackendModule}.${BackendErrors.name}`, () => {

    function expectErrorWithMessage(e: Error): void {
        expect(e.message)
            .toEqual(jasmine.any(String));

        expect(e.message)
            .not.toEqual('');
    }

    it('should return error objects', () => {

        expectErrorWithMessage(BackendErrors.notImplemented());

        expectErrorWithMessage(BackendErrors.missingUserPasswordProof());

    });

});
