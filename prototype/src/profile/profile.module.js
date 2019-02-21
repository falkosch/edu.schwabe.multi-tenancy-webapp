import angular from 'angular';
import uiRouter from '@uirouter/angularjs';
import angularMaterial from 'angular-material';

import { UserStateModule } from '../core/user-state/user-state.module';
import { NavigationModule } from '../core/navigation/navigation.module';
import { GlobalSpinnerModule } from '../ui/global-spinner/global-spinner.module';

import { ProfileComponentName, ProfileComponent } from './profile.component';
import { profileRoute } from './profile.route';
import { profileNavigationRun } from './profile-navigation.run';
import { ProfileUnsetValueFilterName, ProfileUnsetValueFilter } from './profile-unset-value.filter';
import { ProfileUnsetValueFormatterName, ProfileUnsetValueFormatterDirective } from './profile-unset-value.formatter';
import { ProfileUnsetValueParserName, ProfileUnsetValueParserDirective } from './profile-unset-value.parser';

export const ProfileModule = angular
    .module('app.profile', [
        uiRouter,
        angularMaterial,
        NavigationModule,
        UserStateModule,
        GlobalSpinnerModule,
    ])
    .component(ProfileComponentName, ProfileComponent)
    .filter(ProfileUnsetValueFilterName, ProfileUnsetValueFilter)
    .directive(ProfileUnsetValueFormatterName, ProfileUnsetValueFormatterDirective)
    .directive(ProfileUnsetValueParserName, ProfileUnsetValueParserDirective)
    .config(profileRoute)
    .run(profileNavigationRun)
    .name;
