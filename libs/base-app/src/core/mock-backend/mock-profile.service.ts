import _ from 'lodash';

import { ProfileService, ProfileServiceName, Profile } from '../backend/profile.service';
import { AnonymousProfile } from './models/anonymous-profile.model';
import { MockProfilesUrl } from './mock-profiles-url.constant';

export const MockProfileServiceName = ProfileServiceName;

export class MockProfileService extends ProfileService {

    public static $inject = [
        '$http',
        '$q',
    ];

    private _loadProfilesPromise?: angular.IPromise<Profile[]>;

    public constructor(
        private $http: angular.IHttpService,
        $q: angular.IQService,
    ) {
        super($q);
    }

    public resetLoadedProfiles(): void {
        this._loadProfilesPromise = undefined;
    }

    public getProfile(userId: string): angular.IPromise<Profile | AnonymousProfile> {
        return this.loadProfiles()
            .then((profiles) => {
                const profile = _.find(profiles, ['login.uuid', userId]);

                if (profile) {
                    return profile;
                }

                return new AnonymousProfile(userId);
            });
    }

    public loadProfiles(): angular.IPromise<Profile[]> {
        if (!this._loadProfilesPromise) {
            // Let's use some random mock data from randomuser.me
            this._loadProfilesPromise = this.$http
                .get<{ results: Profile[] }>(MockProfilesUrl)
                .then(response => response.data.results);
        }

        return this._loadProfilesPromise;
    }
}
