import { AppModule } from './app.module';
import { AppServiceName } from './app.service';

describe(`${AppModule} ui-router transitions run`, () => {

    const transitionMock = {};

    beforeEach(() => {

        angular.mock.module(AppModule, ($provide) => {

            $provide.value('$transitions', {
                onBefore: jasmine.createSpy('onBefore')
                    .and.callFake((criteria, callback) => callback(transitionMock)),
            });

            $provide.value(AppServiceName, {
                handleBeforeTransition: jasmine.createSpy('handleBeforeTransition'),
            });

        });

    });

    it(`should register an onBefore for all ui-router transitions and delegate the transition event to ${AppServiceName}`, () => {

        inject(($transitions, appService) => {

            expect($transitions.onBefore)
                .toHaveBeenCalledWith(jasmine.objectContaining({}), jasmine.any(Function));

            expect(appService.handleBeforeTransition)
                .toHaveBeenCalledWith(transitionMock);

        });

    });

});
