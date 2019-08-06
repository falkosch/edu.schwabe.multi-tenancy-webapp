import { InjectionServiceName, InjectionService } from '../annotations/injection.service';
import { AuthenticationServiceName, AuthenticationService } from '../backend/authentication.service';
import { EventEmitterServiceName, EventEmitterService } from '../event-emitter/event-emitter.service';
import { Authentication } from '../backend/models/authentication.model';
import { EventEmitter } from '../event-emitter/event-emitter.model';
import { UserState } from './models/user-state.model';
import { Context, ContextInjectName } from './models/user-state-context.model';

export const UserStateServiceName = 'userStateService';

export enum UserStateEvents {
    Login = 'user-state-login',
    Logout = 'user-state-logout',
}

export const ERROR_ALREADY_LOGGED_IN = 'log out first';

export const ERROR_ALREADY_LOGGED_OUT = 'log in first';

class AuthenticatedUserState implements UserState {

    public static $inject = [
        '$q',
        AuthenticationServiceName,
        ContextInjectName,
        'authentication',
    ];

    public constructor(
        private $q: angular.IQService,
        private authenticationService: AuthenticationService,
        private context: Context,
        public readonly authentication: Authentication,
    ) { }

    public get isLoggedIn(): boolean {
        return true;
    }

    public login(
        __userNameClaim: string,
        __userPasswordProof: string,
    ): angular.IPromise<Authentication> {
        return this.$q.reject(new Error(ERROR_ALREADY_LOGGED_IN));
    }

    public logout(): angular.IPromise<void> {
        this.context.nextUserState(AnonymousUserState, {
            authentication: this.authenticationService.anonymous(),
        });
        return this.$q.resolve();
    }
}

class AnonymousUserState implements UserState {

    public static $inject = [
        '$q',
        AuthenticationServiceName,
        ContextInjectName,
        'authentication',
    ];

    public constructor(
        private $q: angular.IQService,
        private authenticationService: AuthenticationService,
        private context: Context,
        public readonly authentication: Authentication,
    ) { }

    public get isLoggedIn(): boolean {
        return false;
    }

    public login(
        userNameClaim: string,
        userPasswordProof: string,
    ): angular.IPromise<Authentication> {
        return this.authenticationService
            .authenticate(userNameClaim, userPasswordProof)
            .then((authentication) => {
                this.context.nextUserState(AuthenticatedUserState, { authentication });
                return authentication;
            });
    }

    public logout(): angular.IPromise<void> {
        return this.$q.reject(new Error(ERROR_ALREADY_LOGGED_OUT));
    }
}

export class UserStateService implements UserState {

    public static $inject = [
        InjectionServiceName,
        EventEmitterServiceName,
        AuthenticationServiceName,
    ];

    public onLogin: EventEmitter<Authentication>;

    public onLogout: EventEmitter<void>;

    private hiddenUserState: UserState;

    private context: Context;

    public constructor(
        injectionService: InjectionService,
        eventEmitterService: EventEmitterService,
        authenticationService: AuthenticationService,
    ) {
        this.onLogin = eventEmitterService.of<Authentication>(UserStateEvents.Login);
        this.onLogout = eventEmitterService.of<void>(UserStateEvents.Logout);

        this.context = new Context(
            injectionService,
            () => this.hiddenUserState,
            (value: UserState) => { this.hiddenUserState = value; },
        );

        this.hiddenUserState = this.context.nextUserState(AnonymousUserState, {
            authentication: authenticationService.anonymous(),
        });
    }

    public get isLoggedIn(): boolean {
        return this.hiddenUserState.isLoggedIn;
    }

    public get authentication(): Authentication {
        return this.hiddenUserState.authentication;
    }

    public login(
        userNameClaim: string,
        userPasswordProof: string,
    ): angular.IPromise<Authentication> {
        return this.hiddenUserState.login(userNameClaim, userPasswordProof)
            .then((authentication: Authentication) => {
                this.onLogin.emit(authentication);
                return authentication;
            });
    }

    public logout(): angular.IPromise<void> {
        return this.hiddenUserState.logout()
            .then(() => { this.onLogout.emit(); });
    }

}
