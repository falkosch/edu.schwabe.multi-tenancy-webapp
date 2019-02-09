import angular from 'angular';
import uiRouter from '@uirouter/angularjs';
import angularTranslate from 'angular-translate';

import { UserStateModule } from '../../core/user-state/user-state.module';
import { GlobalSpinnerModule } from '../../ui/global-spinner/global-spinner.module';
import { BackendModule } from '../../core/backend/backend.module';

import { MenubarComponent, MenubarName } from './menubar.component';

import './i18n/en.json';
import './i18n/de.json';

export const MenubarModule = angular
    .module('app.menubar', [
        uiRouter,
        angularTranslate,
        BackendModule,
        UserStateModule,
        GlobalSpinnerModule,
    ])
    .config([
        '$translatePartialLoaderProvider',
        ($translatePartialLoaderProvider) => { $translatePartialLoaderProvider.addPart(__dirname); },
    ])
    .component(MenubarName, MenubarComponent)
    .name;
