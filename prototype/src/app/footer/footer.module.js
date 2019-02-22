import angular from 'angular';

import { LanguageModule } from '../../core/language/language.module';

import { FooterComponent, FooterComponentName } from './footer.component';
import { footerI18NConfig } from './footer-i18n.config';

import './i18n/de.json';
import './i18n/en.json';

export const FooterModule = angular
    .module('app.footer', [
        LanguageModule,
    ])
    .config(footerI18NConfig)
    .component(FooterComponentName, FooterComponent)
    .name;
