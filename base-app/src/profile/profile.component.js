import { ProfileController } from './profile.controller';

import templateUrl from './profile.template.html';

export const ProfileComponentName = 'appProfile';

export const ProfileComponent = {
    controller: ProfileController,
    templateUrl,
    bindings: {
        viewmodel: '<',
    },
};
