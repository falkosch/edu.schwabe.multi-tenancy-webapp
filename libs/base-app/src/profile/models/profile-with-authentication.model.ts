import { Profile } from '../../core/backend/profile.service';
import { Authentication } from '../../core/backend/models/authentication.model';

export class ProfileWithAuthentication {

    public constructor(
        public readonly profile: Profile,
        public readonly authentication: Authentication,
    ) { }

}
