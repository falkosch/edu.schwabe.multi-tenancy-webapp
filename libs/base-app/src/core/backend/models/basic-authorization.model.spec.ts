import { BackendModule } from '../backend.module';
import { BasicAuthorization } from './basic-authorization.model';

describe(`${BackendModule}.models.${BasicAuthorization.name}`, () => {

    const testSecret = 'TEST';

    let testUnit: BasicAuthorization;

    beforeEach(() => {
        testUnit = new BasicAuthorization();
    });

    it(`should have authorization type ${BasicAuthorization.Type}`, () => {
        expect(testUnit.type)
            .toEqual(BasicAuthorization.Type);
    });

    describe('.setKey(value)', () => {

        it('should be chainable', () => {
            expect(testUnit.setKey(testSecret))
                .toBe(testUnit);
        });

        it('should assign a key as secret', () => {
            expect(testUnit.key)
                .not.toEqual(testSecret);

            testUnit.setKey(testSecret);

            expect(testUnit.key)
                .toEqual(testSecret);
        });

    });

});
