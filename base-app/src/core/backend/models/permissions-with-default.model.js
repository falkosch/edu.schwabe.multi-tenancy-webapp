import { Permissions } from './permissions.model';

export class PermissionsWithDefault extends Permissions {

    setDefault(identId) {
        return this.setPermission(identId, true, true);
    }

}
