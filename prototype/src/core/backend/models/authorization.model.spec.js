import { BackendModule } from '../backend.module';
import { Authorization } from './authorization.model';

describe(`${BackendModule}.models.${Authorization.name}`, () => {

    let testUnit;

    beforeEach(() => {
        testUnit = new Authorization();
    });

    it('should have no authorization type', () => {
        expect(testUnit.type)
            .toBeUndefined();
    });

    describe('.setKey()', () => {

        it('should be chainable', () => {
            expect(testUnit.setKey())
                .toBe(testUnit);
        });

    });

});
