const _ = require('lodash');
const merge = require('webpack-merge');
const puppeteer = require('puppeteer');

const KarmaConfigBuilder = require('../scripts/karma-config-builder');
const testWebpackConfigBuilderFactory = require('./scripts/webpack.test');
const packageProperties = require('./package.json');

const chromePath = puppeteer.executablePath();
process.env.CHROME_BIN = chromePath;
process.env.CHROMIUM_BIN = chromePath;

process.env.NODE_ENV = 'test';

module.exports = (config) => {

    // pass env.* args in "karma start -- --env.*=?" and process.env into an env-object
    // so that f.e. tenant parameters are easily retrievable

    const testEnv = merge(
        process.env,
        config.env,
    );

    config.set(
        new KarmaConfigBuilder()
            .withPackageProperties(packageProperties)
            .withWebpackConfig(
                testWebpackConfigBuilderFactory(__dirname, testEnv)
                    .withPackageProperties(packageProperties)
                    .build(),
            )
            .addConfig({
                browsers: ['ChromiumHeadlessNoSandbox'],
                customLaunchers: {
                    ChromiumHeadlessNoSandbox: {
                        base: 'ChromiumHeadless',
                        flags: ['--no-sandbox'],
                    },
                    ChromeDebugging: {
                        base: 'Chrome',
                        flags: [
                            '--remote-debugging-port=9333',
                            '--auto-open-devtools-for-tabs',
                            'http://localhost:9876/debug.html',
                        ],
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
