import { BackendModule } from '../backend.module';
import { Authentication } from './authentication.model';
import { Authorization } from './authorization.model';
import { Ident } from './ident.model';
import { Permissions } from './permissions.model';

describe(`${BackendModule}.models.${Authentication.name}`, () => {

    const testAuthorization = new Authorization();

    const testPermissions = new Permissions();

    const testIdent = new Ident('TEST');

    let testUnit: Authentication;

    beforeEach(() => {
        testUnit = new Authentication(testIdent);
    });

    describe('.id', () => {

        it('should return value of ident.id', () => {
            expect(testUnit.id)
                .toBe(testIdent.id);
        });

    });

    describe('.setAuthorization(value)', () => {

        it('should be chainable', () => {
            expect(testUnit.setAuthorization(testAuthorization))
                .toBe(testUnit);
        });

        it('should assign an authorization', () => {
            testUnit.setAuthorization(testAuthorization);

            expect(testUnit.authorization)
                .toBe(testAuthorization);
        });

    });

    describe('.setIdent(value)', () => {

        it('should be chainable', () => {
            expect(testUnit.setIdent(testIdent))
                .toBe(testUnit);
        });

        it('should assign an ident', () => {
            testUnit.setIdent(testIdent);

            expect(testUnit.ident)
                .toBe(testIdent);
        });

    });

    describe('.setPermissions(value)', () => {

        it('should be chainable', () => {
            expect(testUnit.setPermissions(testPermissions))
                .toBe(testUnit);
        });

        it('should assign an permissions', () => {
            testUnit.setPermissions(testPermissions);

            expect(testUnit.permissions)
                .toBe(testPermissions);
        });

    });

});
