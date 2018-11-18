import { BackendErrors } from './backend-errors';

export const ProfileServiceName = 'profileService';

export class ProfileService {

    static $inject = ['$q'];

    constructor($q) {
        this.$q = $q;
    }

    getProfile() {
        return this.$q.reject(BackendErrors.notImplemented());
    }

    updateProfile() {
        return this.$q.reject(BackendErrors.notImplemented());
    }
}
