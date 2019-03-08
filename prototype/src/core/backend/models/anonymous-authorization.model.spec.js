import { BackendModule } from '../backend.module';
import { AnonymousAuthorization } from './anonymous-authorization.model';

describe(`${BackendModule}.models.${AnonymousAuthorization.name}`, () => {

    let testUnit;

    beforeEach(() => {
        testUnit = new AnonymousAuthorization();
    });

    it(`should have authorization type ${AnonymousAuthorization.Type}`, () => {
        expect(testUnit.type)
            .toEqual(AnonymousAuthorization.Type);
    });

    describe('.key', () => {

        it('should be undefined', () => {
            expect(testUnit.key)
                .toBeUndefined();
        });

    });

});
