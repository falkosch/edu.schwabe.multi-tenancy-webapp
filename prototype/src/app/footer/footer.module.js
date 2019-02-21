import angular from 'angular';

import { FooterComponent, FooterComponentName } from './footer.component';

export const FooterModule = angular
    .module('app.footer', [])
    .component(FooterComponentName, FooterComponent)
    .name;
