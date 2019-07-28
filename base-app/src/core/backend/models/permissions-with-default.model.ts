import { Permissions } from './permissions.model';

export class PermissionsWithDefault extends Permissions {

    public setDefault(identId: string): PermissionsWithDefault {
        this.setPermission(identId, true, true);
        return this;
    }

}
