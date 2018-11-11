import { BackendErrors } from './backend-errors';
import { BackendModule } from './backend.module';

describe(`${BackendModule}.${BackendErrors.name}`, () => {

    function expectErrorWithMessage(e) {

        expect(e)
            .toEqual(jasmine.any(Error));

        expect(e.message)
            .toEqual(jasmine.any(String));

        expect(e.message.length)
            .toBeGreaterThan(0);

    }


    it('should return error objects', () => {

        expectErrorWithMessage(BackendErrors.notImplemented());

        expectErrorWithMessage(BackendErrors.missingUserPasswordProof());

    });

});
