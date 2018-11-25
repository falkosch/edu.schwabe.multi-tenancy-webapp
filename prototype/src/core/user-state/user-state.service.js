import { InjectionServiceName } from '../annotations/injection.service';
import { AuthenticationServiceName } from '../backend/authentication.service';
import { EventEmitterServiceName } from '../event-emitter/event-emitter.service';

export const UserStateServiceName = 'userStateService';

export class UserStateEvents {

    static Login = 'user-state-login';

    static Logout = 'user-state-logout';

}

class AuthenticatedUser {

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
        return this.$q.reject(new Error('log out first'));
    }

    logout() {
        this.context.userState = new AnonymousUser(this.context);
        return this.$q.resolve();
    }
}

class AnonymousUser {

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
                this.context.userState = new AuthenticatedUser(this.context, authentication);
                return authentication;
            });
    }

    logout() {
        this.context.userState = new AnonymousUser(this.context);
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

        this.onLogin = eventEmitterService.of(UserStateEvents.Login);
        this.onLogout = eventEmitterService.of(UserStateEvents.Logout);

        this.userState = new AnonymousUser(this);
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
