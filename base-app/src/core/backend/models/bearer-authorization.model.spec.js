import { BackendModule } from '../backend.module';
import { BearerAuthorization } from './bearer-authorization.model';

describe(`${BackendModule}.models.${BearerAuthorization.name}`, () => {

    const testSecret = 'TEST';

    let testUnit;

    beforeEach(() => {
        testUnit = new BearerAuthorization();
    });

    it(`should have authorization type ${BearerAuthorization.Type}`, () => {
        expect(testUnit.type)
            .toEqual(BearerAuthorization.Type);
    });

    describe('.setKey(value)', () => {

        it('should be chainable', () => {
            expect(testUnit.setKey())
                .toBe(testUnit);
        });

        it('should assign a key as secret', () => {
            expect(testUnit.key)
                .not
                .toEqual(testSecret);

            testUnit.setKey(testSecret);

            expect(testUnit.key)
                .toEqual(testSecret);
        });

    });

});
