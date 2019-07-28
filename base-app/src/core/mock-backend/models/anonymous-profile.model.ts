// eslint-disable-next-line @typescript-eslint/no-unused-vars
import { Profile } from '../../backend/profile.service';

export class AnonymousProfile implements Profile {

    public login = {
        uuid: '',
    };

    public name = {
        title: '',
        first: '',
        last: '',
    };

    public constructor(userId: string) {
        this.login.uuid = userId;
    }
}
