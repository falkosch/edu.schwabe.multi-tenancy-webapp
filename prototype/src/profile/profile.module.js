import angular from 'angular';
import uiRouter from '@uirouter/angularjs';
import angularMaterial from 'angular-material';

import { NavModule } from '../header/nav/nav.module';
import { UserStateModule } from '../core/user-state/user-state.module';
import { GlobalSpinnerModule } from '../ui/global-spinner/global-spinner.module';

import { ProfileName, ProfileComponent } from './profile.component';
import { profileRoute } from './profile.route';
import { profileNavigationRun } from './profile-navigation.run';

export const ProfileModule = angular
    .module('app.profile', [
        uiRouter,
        angularMaterial,
        NavModule,
        UserStateModule,
        GlobalSpinnerModule,
    ])
    .component(ProfileName, ProfileComponent)
    .config(profileRoute)
    .run(profileNavigationRun)
    .name;
