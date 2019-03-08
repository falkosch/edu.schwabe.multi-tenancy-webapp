export class Permissions {

    static Read = 'read';

    static Write = 'write';

    setPermission(token, read = true, write = false) {
        const permissions = [];
        if (read) {
            permissions.push(Permissions.Read);
        }
        if (write) {
            permissions.push(Permissions.Write);
        }
        return this.setPermissions(token, ...permissions);
    }

    setPermissions(token, ...permissions) {
        this[token] = permissions;
        return this;
    }
}
