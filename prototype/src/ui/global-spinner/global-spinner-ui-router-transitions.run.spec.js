import { GlobalSpinnerModule } from './global-spinner.module';
import { GlobalSpinnerServiceName } from './global-spinner.service';

describe(`${GlobalSpinnerModule} ui-router transitions run`, () => {

    const transitionMock = {};

    let callbackReturn;

    beforeEach(() => {

        angular.mock.module(GlobalSpinnerModule, ($provide) => {

            $provide.value('$transitions', {
                onBefore: jasmine.createSpy('onBefore')
                    .and.callFake((criteria, callback) => {
                        callbackReturn = callback(transitionMock);
                    }),
            });

            $provide.value(GlobalSpinnerServiceName, {
                spinWhileTransition: jasmine.createSpy('spinWhileTransition'),
            });

        });

    });

    it(`should register an onBefore for all ui-router transitions and delegate the transition event to ${GlobalSpinnerServiceName}`, () => {

        inject(($transitions, globalSpinnerService) => {

            expect($transitions.onBefore)
                .toHaveBeenCalledWith(jasmine.objectContaining({}), jasmine.any(Function));

            expect(globalSpinnerService.spinWhileTransition)
                .toHaveBeenCalledWith(transitionMock);

        });

    });

    it('should not return a promise in the onBefore callback', () => {

        inject(() => {

            expect(callbackReturn)
                .toBeUndefined();


        });

    });

});
