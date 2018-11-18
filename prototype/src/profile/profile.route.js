import { ProfileName } from './profile.component';

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
            resolve: {},
            url: '/profile',
            views: {
                main: ProfileName,
            },
        });
}
