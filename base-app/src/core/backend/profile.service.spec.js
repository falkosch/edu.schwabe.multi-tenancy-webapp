import _ from 'lodash';
import angular from 'angular';

import { BackendModule } from './backend.module';
import { BackendErrors } from './backend-errors';

import { ProfileServiceName, ProfileService } from './profile.service';

describe(`${BackendModule}.${ProfileServiceName}`, () => {

    let testUnit;

    let $injector;
    let $rootScope;

    function testMemberToBeNotImplemented(done, asyncInvokable) {
        asyncInvokable()
            .then(() => done.fail('test failed'))
            .catch((e) => {
                expect(e)
                    .toEqual(jasmine.any(Error));

                expect(e.message)
                    .toEqual(BackendErrors.notImplemented().message);

                done();
            });

        $rootScope.$digest();
    }

    beforeEach(() => {

        angular.mock.module(BackendModule);

        inject((_$injector_, _$rootScope_) => {
            $injector = _$injector_;
            $rootScope = _$rootScope_;

            testUnit = $injector.get(ProfileServiceName);
        });

    });

    describe('given architecture', () => {

        const expectedInjects = [
            '$q',
        ];

        it(`should only depend on ${expectedInjects.join(',')}`, () => {
            expect(_.sortBy($injector.annotate(ProfileService)))
                .toEqual(_.sortBy(expectedInjects));
        });

        it(`should be an instanceof ${ProfileService.name}`, () => {
            expect(testUnit)
                .toEqual(jasmine.any(ProfileService));
        });

    });

    describe('.getProfile()', () => {

        it('should mock getProfile with a "not implemented" function returning a reject promise', (done) => {
            testMemberToBeNotImplemented(done, () => testUnit.getProfile());
        });

    });

    describe('.updateProfile()', () => {

        it('should mock updateProfile with a not implemented function returning a reject promise', (done) => {
            testMemberToBeNotImplemented(done, () => testUnit.updateProfile());
        });

    });

    describe('.loadProfiles()', () => {

        it('should mock loadProfiles with a not implemented function returning a reject promise', (done) => {
            testMemberToBeNotImplemented(done, () => testUnit.loadProfiles());
        });

    });

});
