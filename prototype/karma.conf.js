const _ = require('lodash');
const merge = require('webpack-merge');
const path = require('path');

const WithTenantConfigBuilder = require('./scripts/with-tenant-config-builder');

class KarmaConfigBuilder extends WithTenantConfigBuilder {

    constructor() {
        super();
        this.files = [];
        this.envs = [];
        this.preprocessors = [];
    }

    addFile(file) {
        if (WithTenantConfigBuilder.isNotEmptyString(file)) {
            this.files.push(file);
        }
        return this;
    }

    addEnv(env = {}) {
        this.envs.push(env);
        return this;
    }

    withPreprocessors(...preprocessors) {
        this.preprocessors = [...preprocessors];
        return this;
    }

    buildEnv() {
        return merge(...this.envs);
    }

    buildFilesAndPreprocessors() {
        const files = [...this.files];

        if (this.isWithTenant()) {
            files.push(`./tenancy/${this.tenant}/${this.tenant}.karma.js`);
        }

        const builtPreprocessors = _.reduce(
            files,
            (accPreprocessors, file) => {
                accPreprocessors[file] = [...this.preprocessors];
                return accPreprocessors;
            },
            {},
        );

        return {
            files,
            preprocessors: builtPreprocessors,
        };
    }

    build(...appendConfigs) {
        const { files, preprocessors } = this.buildFilesAndPreprocessors();
        const env = this.buildEnv();
        const webpack = testWebpackConfig(env).build();

        const builtConfig = super.build(
            {
                files,
                preprocessors,
                webpack,
            },
            ...appendConfigs,
        );

        console.dir(builtConfig, { depth: 5 });

        return builtConfig;
    }
}

const testWebpackConfig = require('./webpack.test');

module.exports = (config) => {

    // pass env.* args in "karma start -- --env.*=?" and process.env into an env-object
    // so that f.e. tenant parameters are easily retrievable

    const env = merge(
        process.env,
        config.env,
    );

    config.set(
        new KarmaConfigBuilder()
            .addFile('./src/index.karma.js')
            .withTenant(env.tenant)
            .withPreprocessors('webpack', 'sourcemap')
            .addEnv(process.env)
            .addEnv(config.env)
            .addEnv({
                NODE_ENV: 'test',
            })
            .addConfig({
                browsers: [
                    'ChromeHeadless',
                    'PhantomJS',
                ],
                coverageReporter: {
                    dir: 'coverage/',
                    reporters: [
                        { type: 'text' },
                        { type: 'lcov' },
                    ],
                },
                frameworks: [
                    'jasmine',
                ],
                reporters: [
                    'spec',
                    'coverage',
                    'summary',
                ],
                specReporter: {
                    suppressPassed: true,
                },
                webpackMiddleware: {
                    stats: 'minimal',
                },
            })
            .build(),
    );
};
