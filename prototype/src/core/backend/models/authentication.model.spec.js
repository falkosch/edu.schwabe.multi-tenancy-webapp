import { BackendModule } from '../backend.module';
import { Authentication } from './authentication.model';
import { Authorization } from './authorization.model';
import { Ident } from './ident.model';
import { Permissions } from './permissions.model';

describe(`${BackendModule}.models.${Authentication.name}`, () => {

    const testAuthorization = new Authorization();

    const testPermissions = new Permissions();

    const testIdent = new Ident().setId('TEST');

    let testUnit;

    beforeEach(() => {
        testUnit = new Authentication();
    });

    describe('.authorization', () => {

        it(`should equal an object of ${Authorization.name}`, () => {
            expect(testUnit.authorization)
                .toEqual(jasmine.any(Authorization));
        });

    });

    describe('.ident', () => {

        it(`should equal an object of ${Ident.name}`, () => {
            expect(testUnit.ident)
                .toEqual(jasmine.any(Ident));
        });

    });

    describe('.permissions', () => {

        it(`should equal an object of ${Permissions.name}`, () => {
            expect(testUnit.permissions)
                .toEqual(jasmine.any(Permissions));
        });

    });

    describe('.id', () => {

        describe('when ident is set', () => {

            beforeEach(() => {
                testUnit.setIdent(testIdent);
            });

            it('should return ident id', () => {
                expect(testUnit.id)
                    .toBe(testIdent.id);
            });

        });

        describe('when ident is not set', () => {

            beforeEach(() => {
                testUnit.setIdent(undefined);
            });

            it('should return undefined as ident id', () => {
                expect(testUnit.id)
                    .toBeUndefined();
            });

        });

    });

    describe('.setAuthorization(value)', () => {

        it('should return this instance', () => {
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

        it('should return this instance', () => {
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

        it('should return this instance', () => {
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
