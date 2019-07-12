import _ from 'lodash';
import angular from 'angular';

import { ProfileModule } from './profile.module';
import { ProfileStateId } from './profile.route';
import { NavigationServiceName } from '../core/navigation/navigation.service';
import { profileNavigationRun } from './profile-navigation.run';

describe(`${ProfileModule} navigation run`, () => {

    let navigationServiceMock;

    let $injector;

    beforeEach(() => {

        navigationServiceMock = {
            forState: jasmine.createSpy('forState'),
        };

        angular.mock.module(ProfileModule, {
            [NavigationServiceName]: navigationServiceMock,
        });

        inject((_$injector_) => {
            $injector = _$injector_;
        });

    });

    describe('given architecture', () => {

        const expectedInjects = [
            NavigationServiceName,
        ];

        it(`should only depend on ${expectedInjects.join(',')}`, () => {
            expect(_.sortBy($injector.annotate(profileNavigationRun)))
                .toEqual(_.sortBy(expectedInjects));
        });

    });

    it(`should provide a navigation entry for state ${ProfileStateId}`, () => {

        expect(navigationServiceMock.forState)
            .toHaveBeenCalledWith(jasmine.any(String), ProfileStateId);

    });

});
