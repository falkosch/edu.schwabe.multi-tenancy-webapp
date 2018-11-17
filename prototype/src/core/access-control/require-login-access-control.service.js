export const RequireLoginAccessControlServiceName = 'requireLoginAccessControlService';

export class RequireLoginAccessControlService {

    static $inject = [
        '$q',
    ];

    constructor($q) {
        this.$q = $q;
    }

    authorizeAccessToState() {
        return this.$q.when(true);
    }

}
