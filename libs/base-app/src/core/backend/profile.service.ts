import { BackendErrors } from './backend-errors';

export const ProfileServiceName = 'profileService';

export interface ProfileName {
    title: string;
    first: string;
    last: string;
}

export interface Profile {
    login: {
        uuid: string;
    };
    'name': ProfileName;
}

export class ProfileService {

    public static $inject = ['$q'];

    public constructor(protected $q: angular.IQService) { }

    public getProfile(__userId: string): angular.IPromise<Profile> {
        return this.$q.reject(BackendErrors.notImplemented());
    }

    public updateProfile(__profile: Profile): angular.IPromise<any> {
        return this.$q.reject(BackendErrors.notImplemented());
    }

    public loadProfiles(): angular.IPromise<Profile[]> {
        return this.$q.reject(BackendErrors.notImplemented());
    }
}
