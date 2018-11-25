import { IndexModule } from './index.module';
import { StartStateId } from './start/start.route';

describe(`${IndexModule} run`, () => {

    beforeEach(() => {

        angular.mock.module(IndexModule, ($provide) => {
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
