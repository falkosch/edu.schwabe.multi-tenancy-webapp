import _ from 'lodash';
import angular from 'angular';

import { ProfileModule } from './profile.module';
import { ProfileController } from './profile.controller';
import { ProfileComponentName } from './profile.component';
import { GlobalSpinnerServiceName } from '../ui/global-spinner/global-spinner.service';

describe(`${ProfileModule}.${ProfileComponentName} controller`, () => {

    let testUnit;

    let $injector;

    beforeEach(() => {

        angular.mock.module(ProfileModule);

        inject(($componentController, _$injector_) => {
            $injector = _$injector_;

            testUnit = $componentController(ProfileComponentName);
        });

    });

    describe('given architecture', () => {

        const expectedInjects = [
            '$q',
            GlobalSpinnerServiceName,
        ];

        it(`should only depend on ${expectedInjects.join(',')}`, () => {
            expect(_.sortBy($injector.annotate(ProfileController)))
                .toEqual(_.sortBy(expectedInjects));
        });

        it(`should be an instance of ${ProfileController.name}`, () => {
            expect(testUnit)
                .toEqual(jasmine.any(ProfileController));
        });

    });

});
