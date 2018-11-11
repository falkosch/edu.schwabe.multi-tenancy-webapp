import { LoginModule } from './login.module';
import { LoginName } from './login.component';
import { LoginController } from './login.controller';

describe(`${LoginModule}.${LoginName} component controller`, () => {

    let loginController;

    beforeEach(() => {

        angular.mock.module(LoginModule);

        inject(($componentController) => {
            loginController = $componentController(LoginName);
        });

    });

    it(`should be an instanceof ${LoginName} component controller`, () => {

        expect(loginController)
            .toEqual(jasmine.any(LoginController));

    });

});
