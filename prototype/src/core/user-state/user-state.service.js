import { InjectionServiceName } from '../annotations/injection.service';
import { AuthenticationServiceName } from '../backend/authentication.service';

export const UserStateServiceName = 'userStateService';

class AuthenticatedUser {

    static $inject = ['$q'];

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
        this.context.userState = new AnonymousUser(this);
    }
}

class AnonymousUser {

    static $inject = {
        authenticationService: AuthenticationServiceName,
    };

    constructor(context) {
        this.context = context;

        context.injectionService.injectByStaticInjectionNames(this);
    }

    get isLoggedIn() {
        return false;
    }

    login(userNameClaim, userPasswordProof) {
        return this.authenticationService.authenticate(userNameClaim, userPasswordProof)
            .then((authentication) => {
                this.context.userState = new AuthenticatedUser(this.context, authentication);
            });
    }

    logout() {
        this.context.userState = new AnonymousUser(this);
    }
}

export class UserStateService {

    static $inject = [
        '$rootScope',
        InjectionServiceName,
    ];

    static Events = {
        Login: 'user-state-login',
        Logout: 'user-state-logout',
    };

    userState;

    constructor($rootScope, injectionService) {
        this.$rootScope = $rootScope;
        this.injectionService = injectionService;

        this.userState = new AnonymousUser(this);
    }

    get isLoggedIn() {
        return this.userState.isLoggedIn();
    }

    login(userNameClaim, userPasswordProof) {
        return this.userState.login(userNameClaim, userPasswordProof);
    }

    logout() {
        return this.userState.logout();
    }

    fireLoginPre() {
        this.$rootScope.$broadcast(`${UserStateService.Events.Login}:pre`, this.userState);
    }

    fireLoginPost() {
        this.$rootScope.$broadcast(`${UserStateService.Events.Login}:post`, this.userState);
    }

    fireLogoutPre() {
        this.$rootScope.$broadcast(`${UserStateService.Events.Logout}:pre`, this.userState);
    }

    fireLogoutPost() {
        this.$rootScope.$broadcast(`${UserStateService.Events.Logout}:post`, this.userState);
    }
}
