import _ from 'lodash';
import angular from 'angular';

import { StartModule } from './start.module';
import { StartStateId } from './start.route';
import { NavigationServiceName } from '../core/navigation/navigation.service';
import { startNavigationRun } from './start-navigation.run';

describe(`${StartModule} navigation run`, () => {

    let navigationServiceMock;

    let $injector;

    beforeEach(() => {

        navigationServiceMock = {
            forState: jasmine.createSpy('forState'),
        };

        angular.mock.module(StartModule, {
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
            expect(_.sortBy($injector.annotate(startNavigationRun)))
                .toEqual(_.sortBy(expectedInjects));
        });

    });

    it(`should provide a navigation entry for state ${StartStateId}`, () => {

        expect(navigationServiceMock.forState)
            .toHaveBeenCalledWith(jasmine.any(String), StartStateId);

    });

});
