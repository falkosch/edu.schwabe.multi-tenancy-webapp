import _ from 'lodash';
import angular from 'angular';

import { AuthenticationServiceName, AuthenticationService } from './authentication.service';
import { BackendModule } from './backend.module';
import { BackendErrors } from './backend-errors';
import { Authentication } from './models/authentication.model';
import { AnonymousAuthorization } from './models/anonymous-authorization.model';

describe(`${BackendModule}.${AuthenticationServiceName}`, () => {

    let testUnit: AuthenticationService;

    let $injector: angular.auto.IInjectorService;
    let $rootScope: angular.IRootScopeService;

    beforeEach(() => {

        angular.mock.module(BackendModule);

        inject((_$rootScope_, _$injector_) => {
            $rootScope = _$rootScope_;
            $injector = _$injector_;

            testUnit = _$injector_.get(AuthenticationServiceName);
        });

    });

    describe('given architecture', () => {

        const expectedInjects = [
            '$q',
        ];

        it(`should only depend on ${expectedInjects.join(',')}`, () => {
            expect(_.sortBy($injector.annotate(AuthenticationService)))
                .toEqual(_.sortBy(expectedInjects));
        });

        it(`should be an instanceof ${AuthenticationService.name}`, () => {
            expect(testUnit)
                .toEqual(jasmine.any(AuthenticationService));
        });

    });

    describe('.anonymous()', () => {

        it(`should return an ${Authentication.name} with ${AnonymousAuthorization.name}`, () => {

            expect(testUnit.anonymous())
                .toEqual(jasmine.any(Authentication));

            expect(testUnit.anonymous())
                .toEqual(
                    jasmine.objectContaining({
                        authorization: jasmine.any(AnonymousAuthorization),
                    }) as any,
                );

        });

    });

    describe('.authenticate()', () => {

        it('should be a "not implemented" function returning a reject promise', (done) => {

            testUnit.authenticate('test', 'test')
                .then(() => done.fail('test failed'))
                .catch((e: Error) => {

                    expect(e)
                        .toEqual(BackendErrors.notImplemented());

                    done();
                });

            $rootScope.$digest();

        });

    });

});
