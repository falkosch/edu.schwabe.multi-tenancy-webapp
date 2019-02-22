import angular from 'angular';

import { NavModule } from './nav/nav.module';
import { UserStateModule } from '../../core/user-state/user-state.module';
import { GlobalSpinnerModule } from '../../ui/global-spinner/global-spinner.module';
import { LanguageModule } from '../../core/language/language.module';

import { HeaderComponent, HeaderComponentName } from './header.component';
import { headerI18NConfig } from './header-i18n.config';

import './i18n/de.json';
import './i18n/en.json';

export const HeaderModule = angular
    .module('app.header', [
        NavModule,
        UserStateModule,
        LanguageModule,
        GlobalSpinnerModule,
    ])
    .config(headerI18NConfig)
    .component(HeaderComponentName, HeaderComponent)
    .name;
