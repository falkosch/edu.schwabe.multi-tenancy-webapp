import _ from 'lodash';
import angular from 'angular';

import { FooterModule } from './footer.module';
import { FooterComponentName } from './footer.component';
import { FooterController } from './footer.controller';

describe(`${FooterModule}.${FooterComponentName} controller`, () => {

    let testUnit;

    let $injector;

    beforeEach(() => {

        angular.mock.module(FooterModule);

        inject(($componentController, _$injector_) => {
            $injector = _$injector_;

            testUnit = $componentController(FooterComponentName);
        });

    });

    describe('given architecture', () => {

        const expectedInjects = [];

        it(`should only depend on ${expectedInjects.join(',')}`, () => {
            expect(_.sortBy($injector.annotate(FooterController)))
                .toEqual(_.sortBy(expectedInjects));
        });

        it(`should be an instanceof ${FooterController.name}`, () => {
            expect(testUnit)
                .toEqual(jasmine.any(FooterController));
        });

    });

});
