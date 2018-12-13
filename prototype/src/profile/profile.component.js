import { ProfileController } from './profile.controller';

import templateUrl from './profile.template.html';

export const ProfileName = 'appProfile';

export const ProfileComponent = {
    controller: ProfileController,
    templateUrl,
    bindings: {
        viewmodel: '<',
    },
};
