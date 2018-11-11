import { StartModule } from './start.module';
import { StartStateId } from './start.route';

describe(`${StartModule} run`, () => {

    beforeEach(() => {

        angular.mock.module(StartModule, ($provide) => {
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
