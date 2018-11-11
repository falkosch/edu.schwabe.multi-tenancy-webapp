import { AuthenticationServiceName, AuthenticationService } from './authentication.service';
import { BackendModule } from './backend.module';
import { BackendErrors } from './backend-errors';

describe(`${BackendModule}.${AuthenticationServiceName}`, () => {

    let $q;
    let $rootScope;
    let authenticationService;

    beforeEach(() => {

        angular.mock.module(BackendModule);

        inject((_$q_, _$rootScope_, _authenticationService_) => {
            $q = _$q_;
            $rootScope = _$rootScope_;
            authenticationService = _authenticationService_;
        });

    });

    it(`should be an instanceof ${AuthenticationServiceName}`, () => {

        expect(authenticationService)
            .toEqual(jasmine.any(AuthenticationService));

    });

    describe('.authenticate', () => {

        it('should be a not implemented function returning a reject promise', (done) => {

            authenticationService
                .authenticate()
                .catch((e) => {

                    expect(e)
                        .toEqual(jasmine.any(Error));

                    expect(e.message)
                        .toEqual(BackendErrors.notImplemented().message);

                    done();
                });

            $rootScope.$digest();

        });

    });

});
