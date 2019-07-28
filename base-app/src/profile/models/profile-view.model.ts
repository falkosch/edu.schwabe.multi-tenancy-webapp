import { ReactiveViewWithMappings } from '../../core/view-models/reactive-view-with-mappings.model';
import { EventEmitterServiceName, EventEmitterService } from '../../core/event-emitter/event-emitter.service';
import { ProfileWithAuthentication } from './profile-with-authentication.model';

export interface ProfileViewModel {
    username: string;
}

export const ProfileModelInjectName = 'profileModel';

export class ProfileView
    extends ReactiveViewWithMappings<ProfileWithAuthentication, ProfileViewModel> {

    public static $inject = [
        EventEmitterServiceName,
        ProfileModelInjectName,
    ];

    public constructor(
        eventEmitterService: EventEmitterService,
        profileWithAuthentication: ProfileWithAuthentication,
    ) {
        super(eventEmitterService, profileWithAuthentication);

        this.mapProperties({
            username: 'authentication.ident.name',
        });
    }
}
