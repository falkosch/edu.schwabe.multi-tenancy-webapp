import _ from 'lodash';
import angular from 'angular';

import { LoginModule } from './login.module';
import { LoginComponentName } from './login.component';
import { LoginController } from './login.controller';
import { UserStateServiceName } from '../core/user-state/user-state.service';
import { GlobalSpinnerServiceName } from '../ui/global-spinner/global-spinner.service';

describe(`${LoginModule}.${LoginComponentName} controller`, () => {

    let testUnit;

    let $mdDialogMock;
    let alertDialogMock;
    let globalSpinnerServiceMock;
    let userStateServiceMock;

    let $injector;
    let $rootScope;
    let $q;

    beforeEach(() => {

        userStateServiceMock = {
            login: jasmine.createSpy('login'),
        };

        globalSpinnerServiceMock = {
            spinWhilePromise: jasmine.createSpy('spinWhilePromise'),
        };

        alertDialogMock = {
            clickOutsideToClose: jasmine.createSpy('clickOutsideToClose')
                .and
                .callFake(() => alertDialogMock),
            title: jasmine.createSpy('title')
                .and
                .callFake(() => alertDialogMock),
            textContent: jasmine.createSpy('textContent')
                .and
                .callFake(() => alertDialogMock),
            ok: jasmine.createSpy('ok')
                .and
                .callFake(() => alertDialogMock),
            ariaLabel: jasmine.createSpy('ariaLabel')
                .and
                .callFake(() => alertDialogMock),
        };

        $mdDialogMock = {
            show: jasmine.createSpy('show'),
            alert: jasmine.createSpy('alert')
                .and
                .returnValue(alertDialogMock),
        };

        angular.mock.module(LoginModule, {
            [UserStateServiceName]: userStateServiceMock,
            [GlobalSpinnerServiceName]: globalSpinnerServiceMock,
            $mdDialog: $mdDialogMock,
        });

        inject(($componentController, _$injector_, _$rootScope_, _$q_) => {
            $injector = _$injector_;
            $rootScope = _$rootScope_;
            $q = _$q_;
            testUnit = $componentController(LoginComponentName);
        });

    });

    describe('given architecture', () => {

        const expectedInjects = [
            UserStateServiceName,
            GlobalSpinnerServiceName,
            '$mdDialog',
        ];

        it(`should only depend on ${expectedInjects.join(',')}`, () => {
            expect(_.sortBy($injector.annotate(LoginController)))
                .toEqual(_.sortBy(expectedInjects));
        });

        it(`should be an instanceof ${LoginController.name}`, () => {
            expect(testUnit)
                .toEqual(jasmine.any(LoginController));
        });

    });

    describe('.login()', () => {

        const testUsername = 'testuser';
        const testPassword = 'testpassword';

        const testError = new Error('test');

        beforeEach(() => {
            globalSpinnerServiceMock.spinWhilePromise
                .and
                .callFake(promise => promise);

            userStateServiceMock.login
                .and
                .returnValue($q.resolve());

            testUnit.username = testUsername;
            testUnit.password = testPassword;
        });

        it('should show a loading spinner while login', (done) => {
            testUnit.login()
                .finally(() => {

                    expect(globalSpinnerServiceMock.spinWhilePromise)
                        .toHaveBeenCalledWith(
                            jasmine.objectContaining({
                                then: jasmine.any(Function),
                                catch: jasmine.any(Function),
                                finally: jasmine.any(Function),
                            }),
                        );

                    done();
                });

            $rootScope.$digest();
        });

        it('should authenticate the user with name and password', (done) => {
            testUnit.login()
                .finally(() => {
                    expect(userStateServiceMock.login)
                        .toHaveBeenCalledWith(testUsername, testPassword);

                    done();
                });

            $rootScope.$digest();
        });

        describe('when login succeeds', () => {

            beforeEach(() => {
                userStateServiceMock.login
                    .and
                    .returnValue($q.resolve());
            });

            it('should return a resolved promise', (done) => {
                testUnit.login()
                    .then(() => {
                        done();
                    })
                    .catch((e) => {
                        done.fail(e);
                    });

                $rootScope.$digest();
            });

        });

        describe('when login fails', () => {

            beforeEach(() => {
                userStateServiceMock.login
                    .and
                    .returnValue($q.reject(testError));
            });

            function testFailedLogin(done, thenHook = _.noop) {
                testUnit.login()
                    .then(() => {
                        thenHook();
                        done();
                    })
                    .catch((e) => {
                        done.fail(e);
                    });
            }

            it('should catch the rejected promise and return it as resolved', (done) => {
                testFailedLogin(done);

                $rootScope.$digest();
            });

            it('should notify the user about the failed login', (done) => {
                testFailedLogin(done, () => {
                    expect($mdDialogMock.show)
                        .toHaveBeenCalledWith(alertDialogMock);

                    expect($mdDialogMock.alert)
                        .toHaveBeenCalledBefore($mdDialogMock.show);
                });

                $rootScope.$digest();
            });

        });

    });

});
