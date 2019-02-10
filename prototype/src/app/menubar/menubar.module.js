import angular from 'angular';
import uiRouter from '@uirouter/angularjs';

import { BackendModule } from '../../core/backend/backend.module';
import { GlobalSpinnerModule } from '../../ui/global-spinner/global-spinner.module';
import { LanguageModule } from '../../core/language/language.module';
import { UserStateModule } from '../../core/user-state/user-state.module';

import { menubarConfig } from './menubar.config';

import { MenubarComponent, MenubarName } from './menubar.component';

import './i18n/en.json';
import './i18n/de.json';

export const MenubarModule = angular
    .module('app.menubar', [
        uiRouter,

        BackendModule,
        GlobalSpinnerModule,
        LanguageModule,
        UserStateModule,
    ])
    .config(menubarConfig)
    .component(MenubarName, MenubarComponent)
    .name;
