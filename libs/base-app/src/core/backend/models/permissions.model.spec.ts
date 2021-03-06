import { BackendModule } from '../backend.module';
import { Permissions } from './permissions.model';

describe(`${BackendModule}.models.${Permissions.name}`, () => {

    const testPermissionToken = 'test';
    const testPermission = 'TEST';

    let testUnit: Permissions;

    beforeEach(() => {
        testUnit = new Permissions();
    });

    describe('.setPermission(token, read, write)', () => {

        it('should be chainable', () => {
            expect(testUnit.setPermission(testPermissionToken))
                .toBe(testUnit);
        });

        it(`should setup permissions array with value ${Permissions.Read} by default`, () => {
            testUnit.setPermission(testPermissionToken);

            expect(testUnit.getPermissions(testPermissionToken))
                .toEqual([Permissions.Read]);
        });

        describe('when neither read nor write permission is given', () => {

            it(`should setup permissions array without values ${Permissions.Read} and ${Permissions.Write}`, () => {
                testUnit.setPermission(testPermissionToken, false, false);

                expect(testUnit.getPermissions(testPermissionToken))
                    .toEqual([]);
            });

        });

        describe('when read permission is given', () => {

            it(`should setup permissions array with value ${Permissions.Read}`, () => {
                testUnit.setPermission(testPermissionToken, true, false);

                expect(testUnit.getPermissions(testPermissionToken))
                    .toEqual([Permissions.Read]);
            });

        });

        describe('when write permission is given', () => {

            it(`should setup permissions array with value ${Permissions.Write}`, () => {
                testUnit.setPermission(testPermissionToken, false, true);

                expect(testUnit.getPermissions(testPermissionToken))
                    .toEqual([Permissions.Write]);
            });

        });

        describe('when read and write permission is given', () => {

            it(`should setup permissions array with values ${Permissions.Read} and ${Permissions.Write}`, () => {
                testUnit.setPermission(testPermissionToken, true, true);

                expect(testUnit.getPermissions(testPermissionToken))
                    .toEqual(jasmine.arrayContaining([Permissions.Read, Permissions.Write]));
            });

        });

    });

    describe('.setPermissions(token, ...permissions)', () => {

        it('should be chainable', () => {
            expect(testUnit.setPermissions(testPermissionToken, testPermission))
                .toBe(testUnit);
        });

        it('should setup permissions array for permission tokens', () => {
            testUnit.setPermissions(testPermissionToken, testPermission);

            expect(testUnit.getPermissions(testPermissionToken))
                .toEqual([testPermission]);
        });

    });

});
