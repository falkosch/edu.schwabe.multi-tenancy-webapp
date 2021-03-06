import _ from 'lodash';
import angular from 'angular';

import { StartModule } from './start.module';
import { StartController } from './start.controller';
import { StartComponentName } from './start.component';

describe(`${StartModule}.${StartComponentName} controller`, () => {

    let testUnit: StartController;

    let $injector: angular.auto.IInjectorService;

    beforeEach(() => {

        angular.mock.module(StartModule);

        inject(($componentController, _$injector_) => {
            $injector = _$injector_;
            testUnit = $componentController(StartComponentName);
        });

    });

    describe('given architecture', () => {

        const expectedInjects: string[] = [];

        it(`should only depend on ${expectedInjects.join(',')}`, () => {
            expect(_.sortBy($injector.annotate(StartController)))
                .toEqual(_.sortBy(expectedInjects));
        });

        it(`should be an instance of ${StartController.name}`, () => {
            expect(testUnit)
                .toEqual(jasmine.any(StartController));
        });

    });

    describe('.allImages', () => {

        it('should provide a list of objects with a headline and a source', () => {

            expect(testUnit.allImages)
                .not.toEqual([]);

            _.forEach(testUnit.allImages, (image) => {
                expect(image)
                    .toEqual({
                        headline: jasmine.any(String),
                        source: jasmine.anything(),
                    });
            });

        });

    });

});
