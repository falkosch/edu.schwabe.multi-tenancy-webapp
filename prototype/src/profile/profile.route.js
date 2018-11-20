import _ from 'lodash';

import { ProfileName } from './profile.component';
import { UserStateServiceName } from '../core/user-state/user-state.service';
import { ProfileServiceName } from '../core/backend/profile.service';
import { InjectionServiceName } from '../core/annotations/injection.service';
import { ProfileViewModel } from './profile.viewmodel';

profileRoute.$inject = ['$stateProvider'];

export const ProfileStateId = 'app.profile';

export function profileRoute($stateProvider) {
    $stateProvider
        .state({
            name: ProfileStateId,
            accessControl: {
                public: true,
            },
            data: {
                title: 'Profile',
            },
            resolve: {
                authentication: [
                    UserStateServiceName,
                    userStateService => _.cloneDeep(userStateService.authentication),
                ],
                profile: [
                    ProfileServiceName,
                    'authentication',
                    (profileService, authentication) => profileService
                        .getProfile(authentication.id),
                ],
                viewmodel: [
                    InjectionServiceName,
                    'authentication',
                    'profile',
                    (injectionService, authentication, profile) => new ProfileViewModel(
                        injectionService,
                        {
                            authentication,
                            profile,
                        },
                    ),
                ],
            },
            url: '/profile',
            views: {
                main: ProfileName,
            },
        });
}
