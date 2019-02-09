import angular from 'angular';
import angularAnimate from 'angular-animate';
import angularAria from 'angular-aria';
import angularMessages from 'angular-messages';
import angularSanitize from 'angular-sanitize';
import uiRouter from '@uirouter/angularjs';

import angularMaterial from 'angular-material';

import './index.scss';

import { AppModule } from './app/app.module';
import { StartModule } from './start/start.module';
import { LoginModule } from './login/login.module';
import { ProfileModule } from './profile/profile.module';
import { CoreModule } from './core/core.module';

import { indexHtml5Config } from './index-html5.config';
import { indexRun } from './index.run';

export const IndexModule = angular
    .module('index', [
        angularAnimate,
        angularAria,
        angularMessages,
        angularSanitize,
        uiRouter,

        angularMaterial,

        AppModule,
        StartModule,
        LoginModule,
        ProfileModule,
        CoreModule,
    ])
    .config(indexHtml5Config)
    .run(indexRun)
    .name;
