import _ from 'lodash';
import angular from 'angular';

import { GlobalSpinnerModule } from './global-spinner.module';
import { GlobalSpinnerServiceName } from './global-spinner.service';
import { globalSpinnerUiRouterTransitionsRun } from './global-spinner-ui-router-transitions.run';

describe(`${GlobalSpinnerModule} ui-router transitions run`, () => {

    let callbackReturn;

    let $transitionsMock;
    let globalSpinnerServiceMock;

    let $injector;

    beforeEach(() => {

        $transitionsMock = {
            onBefore: jasmine.createSpy('onBefore')
                .and
                .callFake((criteria, callback) => {
                    callbackReturn = callback($transitionsMock);
                }),
        };

        globalSpinnerServiceMock = {
            spinWhileTransition: jasmine.createSpy('spinWhileTransition'),
        };

        angular.mock.module(GlobalSpinnerModule, {
            $transitions: $transitionsMock,
            [GlobalSpinnerServiceName]: globalSpinnerServiceMock,
        });

        inject((_$injector_) => {
            $injector = _$injector_;
        });

    });

    describe('given architecture', () => {

        const expectedInjects = [
            '$transitions',
            GlobalSpinnerServiceName,
        ];

        it(`should only depend on ${expectedInjects.join(',')}`, () => {
            expect(_.sortBy($injector.annotate(globalSpinnerUiRouterTransitionsRun)))
                .toEqual(_.sortBy(expectedInjects));
        });

    });

    it(`should register an onBefore for all ui-router transitions and delegate the transition event to ${GlobalSpinnerServiceName}`, () => {

        expect($transitionsMock.onBefore)
            .toHaveBeenCalledWith(jasmine.objectContaining({}), jasmine.any(Function));

        expect(globalSpinnerServiceMock.spinWhileTransition)
            .toHaveBeenCalledWith($transitionsMock);

    });

    it('should not return a promise in the onBefore callback', () => {

        expect(callbackReturn)
            .toBeUndefined();

    });

});
