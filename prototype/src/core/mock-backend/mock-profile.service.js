import _ from 'lodash';

import { ProfileService, ProfileServiceName } from '../backend/profile.service';
import { MockProfilesUrlName } from './mock-profiles-url.constant';

export const MockProfileServiceName = ProfileServiceName;

export class MockProfileService extends ProfileService {

    static $inject = [
        '$q',
        '$http',
        MockProfilesUrlName,
    ];

    profiles = [];

    constructor($q, $http, mockProfilesUrl) {
        super($q);
        this.$http = $http;
        this.mockProfilesUrl = mockProfilesUrl;

        this.initializePromise = this._initialize();
    }

    _initialize() {

        // Let's use some random mock data from randomuser.me

        return this.$http.get(this.mockProfilesUrl)
            .then((response) => {
                this.profiles = response.data.results;
                return this.profiles;
            });

    }

    getProfile(userId) {
        return this.$q.when(this.initializePromise)
            .then(profiles => _.find(profiles, ['login.uuid', userId]));
    }

    updateProfile() {
        return this.$q.when();
    }
}
