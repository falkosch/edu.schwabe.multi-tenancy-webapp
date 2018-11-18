import { BackendModule } from './backend.module';
import { BackendErrors } from './backend-errors';

import { ProfileServiceName, ProfileService } from './profile.service';

describe(`${BackendModule}.${ProfileServiceName}`, () => {

    let profileService;
    let $rootScope;

    beforeEach(() => {

        angular.mock.module(BackendModule);

        inject((_$rootScope_, _profileService_) => {
            $rootScope = _$rootScope_;
            profileService = _profileService_;
        });

    });

    it(`should be an instanceof ${ProfileServiceName}`, () => {

        expect(profileService)
            .toEqual(jasmine.any(ProfileService));

    });

    describe('.getProfile', () => {

        it('should be a not implemented function returning a reject promise', (done) => {

            profileService
                .getProfile()
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

    describe('.updateProfile', () => {

        it('should be a not implemented function returning a reject promise', (done) => {

            profileService
                .updateProfile()
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
