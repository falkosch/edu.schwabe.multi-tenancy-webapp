import { AppModule } from './app.module';
import { StartStateId } from './start/start.route';

describe(`${AppModule} run`, () => {

    beforeEach(() => {

        angular.mock.module(AppModule, ($provide) => {
            $provide.value('$state', {
                go: jasmine.createSpy('go'),
            });
        });

    });

    it(`should go to state ${StartStateId}`, () => {

        inject(($state) => {
            expect($state.go)
                .toHaveBeenCalledWith(StartStateId);
        });

    });

});
