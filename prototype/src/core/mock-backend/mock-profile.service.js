import _ from 'lodash';

import { ProfileService, ProfileServiceName } from '../backend/profile.service';
import { AnonymousProfile } from './models/anonymous-profile.model';
import { MockProfilesUrl } from './mock-profiles-url.constant';

export const MockProfileServiceName = ProfileServiceName;

export class MockProfileService extends ProfileService {

    static $inject = [
        '$http',
        '$q',
    ];

    constructor($http, $q) {
        super($q);
        this.$http = $http;
    }

    getProfile(userId) {
        return this._loadProfiles()
            .then((profiles) => {
                const profile = _.find(profiles, ['login.uuid', userId]);

                if (profile) {
                    return profile;
                }

                return new AnonymousProfile(userId);
            });
    }

    _loadProfiles() {
        if (!this._loadProfilesPromise) {
            // Let's use some random mock data from randomuser.me
            this._loadProfilesPromise = this.$http
                .get(MockProfilesUrl)
                .then(response => response.data.results);
        }

        return this._loadProfilesPromise;
    }
}
