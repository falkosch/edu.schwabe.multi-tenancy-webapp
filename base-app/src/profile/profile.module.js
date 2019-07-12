import angular from 'angular';
import uiRouter from '@uirouter/angularjs';
import angularMaterial from 'angular-material';

import { UserStateModule } from '../core/user-state/user-state.module';
import { NavigationModule } from '../core/navigation/navigation.module';
import { GlobalSpinnerModule } from '../ui/global-spinner/global-spinner.module';
import { LanguageModule } from '../core/language/language.module';

import { ProfileComponentName, ProfileComponent } from './profile.component';
import { profileRoute } from './profile.route';
import { profileI18NConfig } from './profile-i18n.config';
import { profileNavigationRun } from './profile-navigation.run';
import { ProfileUnsetValueFilter, ProfileUnsetValueProviderName } from './profile-unset-value.filter';

import './i18n/de.json';
import './i18n/en.json';

export const ProfileModule = angular
    .module('app.profile', [
        uiRouter,
        angularMaterial,
        LanguageModule,
        NavigationModule,
        UserStateModule,
        GlobalSpinnerModule,
    ])
    .component(ProfileComponentName, ProfileComponent)
    .filter(ProfileUnsetValueProviderName, ProfileUnsetValueFilter)
    .config(profileRoute)
    .config(profileI18NConfig)
    .run(profileNavigationRun)
    .name;
