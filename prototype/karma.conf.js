const _ = require('lodash');
const merge = require('webpack-merge');
const puppeteer = require('puppeteer');

const KarmaConfigBuilder = require('./scripts/karma-config-builder');

const testWebpackConfigBuilderFactory = require('./scripts/webpack.test');

process.env.NODE_ENV = 'test';
process.env.CHROME_BIN = puppeteer.executablePath();

module.exports = (config) => {

    // pass env.* args in "karma start -- --env.*=?" and process.env into an env-object
    // so that f.e. tenant parameters are easily retrievable

    const testEnv = merge(
        process.env,
        config.env,
    );

    config.set(
        new KarmaConfigBuilder()
            .withTenant(testEnv.tenant)
            .withWebpackConfig(
                testWebpackConfigBuilderFactory(testEnv, __dirname)
                    .build(),
            )
            .addConfig({
                browsers: ['ChromeHeadlessNoSandbox'],
                customLaunchers: {
                    ChromeHeadlessNoSandbox: {
                        base: 'ChromeHeadless',
                        flags: ['--no-sandbox'],
                    },
                },
                coverageReporter: {
                    reporters: [
                        { type: 'text' },
                    ],
                },
                reporters: _.concat(
                    testEnv.noSpec ? [] : ['spec'],
                    testEnv.noCoverage ? [] : ['coverage'],
                    ['summary'],
                ),
                specReporter: {
                    showSpecTiming: true,
                    suppressErrorSummary: false,
                    suppressPassed: true,
                    suppressSkipped: true,
                    failFast: false,
                },
                summaryReporter: {
                    specLength: 80,
                },
            })
            .build(),
    );
};
