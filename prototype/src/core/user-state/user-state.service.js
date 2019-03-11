import { InjectionServiceName } from '../annotations/injection.service';
import { AuthenticationServiceName } from '../backend/authentication.service';
import { EventEmitterServiceName } from '../event-emitter/event-emitter.service';

export const UserStateServiceName = 'userStateService';

export const UserStateEventLogin = 'user-state-login';

export const UserStateEventLogout = 'user-state-logout';

export const ERROR_ALREADY_LOGGED_IN = 'log out first';

class AuthenticatedUserState {

    static $inject = [
        '$q',
    ];

    authentication;

    constructor(context, authentication) {
        this.context = context;
        this.authentication = authentication;

        context.injectionService.injectByStaticInjectionNames(this);
    }

    get isLoggedIn() {
        return true;
    }

    login() {
        return this.$q.reject(new Error(ERROR_ALREADY_LOGGED_IN));
    }

    logout() {
        this.context.userState = new AnonymousUserState(this.context);
        return this.$q.resolve();
    }
}

class AnonymousUserState {

    static $inject = [
        '$q',
        AuthenticationServiceName,
    ];

    authentication;

    constructor(context) {
        this.context = context;
        context.injectionService.injectByStaticInjectionNames(this);

        this.authentication = this.authenticationService.anonymous;
    }

    get isLoggedIn() {
        return false;
    }

    login(userNameClaim, userPasswordProof) {
        return this.authenticationService
            .authenticate(userNameClaim, userPasswordProof)
            .then((authentication) => {
                this.context.userState = new AuthenticatedUserState(this.context, authentication);
                return authentication;
            });
    }

    logout() {
        this.context.userState = new AnonymousUserState(this.context);
        return this.$q.resolve();
    }
}

export class UserStateService {

    static $inject = [
        '$rootScope',
        InjectionServiceName,
        EventEmitterServiceName,
    ];

    onLogin;

    onLogout;

    userState;

    constructor(
        $rootScope,
        injectionService,
        eventEmitterService,
    ) {
        this.$rootScope = $rootScope;
        this.injectionService = injectionService;

        this.onLogin = eventEmitterService.of(UserStateEventLogin);
        this.onLogout = eventEmitterService.of(UserStateEventLogout);

        this.userState = new AnonymousUserState(this);
    }

    get isLoggedIn() {
        return this.userState.isLoggedIn;
    }

    get authentication() {
        return this.userState.authentication;
    }

    login(userNameClaim, userPasswordProof) {
        return this.userState
            .login(userNameClaim, userPasswordProof)
            .then((authentication) => {
                this.onLogin.emit(authentication);
                return authentication;
            });
    }

    logout() {
        return this.userState
            .logout()
            .then(() => {
                this.onLogout.emit();
            });
    }

}
