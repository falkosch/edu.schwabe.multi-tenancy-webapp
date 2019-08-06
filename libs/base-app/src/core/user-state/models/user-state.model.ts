import { Authentication } from '../../backend/models/authentication.model';

export interface UserState {
    readonly authentication: Authentication;
    readonly isLoggedIn: boolean;
    login(userNameClaim: string, userPasswordProof: string): angular.IPromise<Authentication>;
    logout(): angular.IPromise<void>;
}
