import angular from 'angular';

import { BackendModule } from './backend.module';
import { BackendErrors } from './backend-errors';

import { ProfileServiceName, ProfileService } from './profile.service';

describe(`${BackendModule}.${ProfileServiceName}`, () => {

    let profileService;
    let $rootScope;

    function testErrorIsNotImplementedError(error) {
        expect(error)
            .toEqual(jasmine.any(Error));

        expect(error.message)
            .toEqual(BackendErrors.notImplemented().message);
    }

    function testMemberToBeNotImplemented(done, asyncInvokable) {
        asyncInvokable()
            .then(() => done(new Error('test failed')))
            .catch((e) => {
                testErrorIsNotImplementedError(e);
                done();
            });

        $rootScope.$digest();
    }

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

        it('should mock getProfile with a not implemented function returning a reject promise', (done) => {

            testMemberToBeNotImplemented(
                done,
                () => profileService.getProfile(),
            );

        });

    });

    describe('.updateProfile', () => {

        it('should mock updateProfile with a not implemented function returning a reject promise', (done) => {

            testMemberToBeNotImplemented(
                done,
                () => profileService.updateProfile(),
            );

        });

    });

});
