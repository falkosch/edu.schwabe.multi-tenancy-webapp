import _ from 'lodash';

import { StateProvider } from '@uirouter/angularjs';
import { ProfileComponentName } from './profile.component';
import { UserStateServiceName, UserStateService } from '../core/user-state/user-state.service';
import { ProfileServiceName, ProfileService, Profile } from '../core/backend/profile.service';
import { ProfileView } from './models/profile-view.model';
import { Authentication } from '../core/backend/models/authentication.model';
import { ProfileViewBindingName } from './profile.controller';
import { EventEmitterService, EventEmitterServiceName } from '../core/event-emitter/event-emitter.service';
import { ProfileWithAuthentication } from './models/profile-with-authentication.model';

profileRoute.$inject = ['$stateProvider'];

export const ProfileStateId = 'app.profile';

export function profileRoute($stateProvider: StateProvider): void {
    $stateProvider
        .state({
            name: ProfileStateId,
            accessControl: {
                requiresLogin: true,
            },
            data: {
                title: 'profile.navigation-entry',
            },
            resolve: {
                authentication: [
                    UserStateServiceName,
                    (
                        userStateService: UserStateService,
                    ) => _.cloneDeep(userStateService.authentication),
                ],
                profile: [
                    ProfileServiceName,
                    'authentication',
                    (
                        profileService: ProfileService,
                        authentication: Authentication,
                    ) => profileService.getProfile(authentication.id),
                ],
                [ProfileViewBindingName]: [
                    EventEmitterServiceName,
                    'authentication',
                    'profile',
                    (
                        eventEmitterService: EventEmitterService,
                        authentication: Authentication,
                        profile: Profile,
                    ) => new ProfileView(eventEmitterService, new ProfileWithAuthentication(
                        profile,
                        authentication,
                    )),
                ],
            },
            url: '/profile',
            views: {
                main: ProfileComponentName,
            },
        });
}
