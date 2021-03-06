import { BackendModule } from '../backend.module';
import { PermissionsWithDefault } from './permissions-with-default.model';
import { Permissions } from './permissions.model';

describe(`${BackendModule}.models.${PermissionsWithDefault.name}`, () => {

    const testIdentId = 'TEST';

    let testUnit: PermissionsWithDefault;

    beforeEach(() => {
        testUnit = new PermissionsWithDefault();
    });

    describe('setDefault(identId)', () => {

        it('should be chainable', () => {
            expect(testUnit.setDefault(testIdentId))
                .toBe(testUnit);
        });

        it(`should setup permissions array with values ${Permissions.Read} and ${Permissions.Write} by default`, () => {
            testUnit.setDefault(testIdentId);

            expect(testUnit.getPermissions(testIdentId))
                .toEqual([Permissions.Read, Permissions.Write]);
        });

    });

});
