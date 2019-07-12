
export class AnonymousProfile {

    login = {
        uuid: undefined,
    };

    constructor(userId) {
        this.login.uuid = userId;
    }
}
