import angular from 'angular';

import { HeaderComponent, HeaderName } from './header.component';
import { NavModule } from './nav/nav.module';

export const HeaderModule = angular
    .module('app.header', [
        NavModule,
    ])
    .component(HeaderName, HeaderComponent)
    .name;
