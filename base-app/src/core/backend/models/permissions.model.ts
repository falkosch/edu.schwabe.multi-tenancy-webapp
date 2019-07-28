export class Permissions {

    public static Read = 'read';

    public static Write = 'write';

    public readonly tokens: Record<string, string[]> = {};

    public getPermissions(token: string): string[] {
        return this.tokens[token] || [];
    }

    public setPermission(token: string, read = true, write = false): Permissions {
        const permissions = [];
        if (read) {
            permissions.push(Permissions.Read);
        }
        if (write) {
            permissions.push(Permissions.Write);
        }
        return this.setPermissions(token, ...permissions);
    }

    public setPermissions(token: string, ...permissions: string[]): Permissions {
        this.tokens[token] = permissions || [];
        return this;
    }
}
