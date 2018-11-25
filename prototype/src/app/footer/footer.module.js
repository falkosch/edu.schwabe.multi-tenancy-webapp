import angular from 'angular';

import { FooterComponent, FooterName } from './footer.component';

export const FooterModule = angular
    .module('app.footer', [])
    .component(FooterName, FooterComponent)
    .name;
