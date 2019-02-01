import angular from 'angular';

import { FooterModule } from './footer.module';
import { FooterName } from './footer.component';
import { FooterController } from './footer.controller';

describe(`${FooterModule}.${FooterName} component controller`, () => {

    let footerController;

    beforeEach(() => {

        angular.mock.module(FooterModule);

        inject(($componentController) => {
            footerController = $componentController(FooterName);
        });

    });

    it(`should be an instanceof ${FooterName} component controller`, () => {

        expect(footerController)
            .toEqual(jasmine.any(FooterController));

    });

});
